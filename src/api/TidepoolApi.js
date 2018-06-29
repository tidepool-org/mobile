import axios from "axios";
import uuidv4 from "uuid/v4";
import parse from "date-fns/parse";

import GraphData from "../models/GraphData";

// TODO: api - default timeout for requests

// TODO: api - update User-Agent in the header for all requests to indicate the app name and version, build info,
// iOS version, etc, similar to Tidepool Mobile, e.g.:
// "Nutshell/2.0.3 (org.tidepool.blipnotes; build:460; iOS 11.1.0) Alamofire/4.3.0")
// "Nutshell/460 CFNetwork/889.9 Darwin/17.2.0"

class TidepoolApi {
  constructor({ baseUrl }) {
    this.baseUrl = baseUrl;
    this.sessionToken = "";
  }

  //
  // Async helpers
  //

  async refreshTokenAsync({ sessionToken: previousSessionToken }) {
    const { sessionToken, userId, errorMessage } = await this.refreshToken({
      sessionToken: previousSessionToken,
    })
      .then(response => ({
        sessionToken: response.sessionToken,
        userId: response.userId,
      }))
      .catch(error => ({
        errorMessage: error.message,
      }));

    return { sessionToken, userId, errorMessage };
  }

  async signInAsync({ username, password }) {
    const { sessionToken, userId, errorMessage } = await this.signIn({
      username,
      password,
    })
      .then(response => ({
        sessionToken: response.sessionToken,
        userId: response.userId,
      }))
      .catch(error => ({
        errorMessage: error.message,
      }));

    return { sessionToken, userId, errorMessage };
  }

  async fetchProfileAsync({ userId }) {
    const { errorMessage, ...rest } = await this.fetchProfile({
      userId,
    })
      .then(response => ({
        profile: response,
      }))
      .catch(error => ({
        errorMessage: error.message,
      }));

    return { userId, ...rest, errorMessage };
  }

  async fetchProfileSettingsAsync({ userId }) {
    const { settings, errorMessage } = await this.fetchProfileSettings({
      userId,
    })
      .then(response => ({
        settings: response.settings,
      }))
      .catch(error => ({
        errorMessage: error.message,
      }));

    return { settings, errorMessage };
  }

  async fetchNotesAsync({ userId }) {
    const { notes, errorMessage } = await this.fetchNotes({
      userId,
    })
      .then(response => {
        // Map notes
        const sortedNotes = response.notes.map(responseNote => {
          let userFullName = "";
          if (responseNote.user && responseNote.user.fullName) {
            userFullName = responseNote.user.fullName;
          }

          const mappedNote = {
            id: responseNote.id,
            timestamp: parse(responseNote.timestamp),
            messageText: responseNote.messagetext,
            parentMessageId: responseNote.parentmessage,
            userId: responseNote.userid,
            userFullName,
            groupId: responseNote.groupid,
            createdTime: responseNote.createdtime,
          };
          return mappedNote;
        });
        // Sort notes reverse chronologically by timestamp
        sortedNotes.sort((note1, note2) => note2.timestamp - note1.timestamp);
        return { notes: sortedNotes };
      })
      .catch(error => ({
        errorMessage: error.message,
      }));

    return { notes, errorMessage };
  }

  async fetchCommentsAsync({ messageId }) {
    const { comments, errorMessage } = await this.fetchComments({
      messageId,
    })
      .then(response => {
        // Map comments
        const sortedComments = response.comments.map(responseComment => {
          const mappedComment = {
            id: responseComment.id,
            timestamp: parse(responseComment.timestamp),
            messageText: responseComment.messagetext,
            parentMessageId: responseComment.parentmessage,
            userId: responseComment.userid,
            groupId: responseComment.groupid,
            createdTime: responseComment.createdtime,
            userFullName: responseComment.user.fullName,
          };
          return mappedComment;
        });
        // Sort comments chronologically by timestamp
        sortedComments.sort(
          (comment1, comment2) => comment1.timestamp - comment2.timestamp
        );
        return { comments: sortedComments };
      })
      .catch(error => ({
        errorMessage: error.message,
      }));

    return { comments, errorMessage };
  }

  async fetchViewableUserProfilesAsync({ userId, fullName }) {
    let errorMessage;
    let profiles = [];

    // Get other viewable user ids
    const {
      userIds,
      errorMessage: fetchOtherViewableUserIdsErrorMessage,
    } = await this.fetchOtherViewableUserIds({
      userId,
    })
      .then(response => ({
        userIds: response.userIds,
      }))
      .catch(error => ({
        errorMessage: error.message,
      }));

    errorMessage = fetchOtherViewableUserIdsErrorMessage;

    // Get profiles for other viewable user ids
    if (!errorMessage) {
      const fetchProfilePromises = userIds.map(fetchProfileUserId =>
        this.fetchProfile({ userId: fetchProfileUserId })
      );

      const {
        profiles: fetchProfilePromisesProfiles,
        errorMessage: fetchProfilePromisesErrorMessage,
      } = await Promise.all(fetchProfilePromises)
        .then(response => ({
          profiles: response,
        }))
        .catch(error => ({ fetchProfilePromisesErrorMessage: error.message }));

      errorMessage = fetchProfilePromisesErrorMessage;
      profiles = fetchProfilePromisesProfiles;
    }

    // Sort profiles by fullName
    profiles.sort((profile1, profile2) =>
      profile1.fullName.localeCompare(profile2.fullName)
    );

    // Add the specified user profile to front of list
    const viewableUserProfiles = [{ userId, fullName }, ...profiles];

    return { profiles: viewableUserProfiles, errorMessage };
  }

  async addNoteAsync({ currentUser, currentProfile, messageText, timestamp }) {
    const { errorMessage, note } = await this.addNote({
      currentUser,
      currentProfile,
      messageText,
      timestamp,
    })
      .then(response => ({
        note: response.note,
      }))
      .catch(error => ({
        errorMessage: error.message,
      }));

    return { errorMessage, note };
  }

  async updateNoteAsync({ note }) {
    const { errorMessage } = await this.updateNote({
      note,
    })
      .then(() => ({}))
      .catch(error => ({
        errorMessage: error.message,
      }));

    return { errorMessage };
  }

  async deleteNoteAsync({ note }) {
    const { id } = note;
    const { errorMessage } = await this.deleteCommentOrNote({
      id,
    })
      .then(() => ({}))
      .catch(error => ({
        errorMessage: error.message,
      }));

    return { errorMessage };
  }

  async addCommentAsync({
    currentUser,
    currentProfile,
    note,
    messageText,
    timestamp,
  }) {
    const { errorMessage, comment } = await this.addComment({
      currentUser,
      currentProfile,
      note,
      messageText,
      timestamp,
    })
      .then(response => ({
        comment: response.comment,
      }))
      .catch(error => ({
        errorMessage: error.message,
      }));

    return { errorMessage, comment };
  }

  async updateCommentAsync({ comment }) {
    const { errorMessage } = await this.updateComment({
      comment,
    })
      .then(() => ({}))
      .catch(error => ({
        errorMessage: error.message,
      }));

    return { errorMessage };
  }

  async deleteCommentAsync({ comment }) {
    const { id } = comment;
    const { errorMessage } = await this.deleteCommentOrNote({
      id,
    })
      .then(() => ({}))
      .catch(error => ({
        errorMessage: error.message,
      }));

    return { errorMessage };
  }

  async fetchGraphDataAsync({
    userId,
    noteDate,
    startDate,
    endDate,
    objectTypes,
    lowBGBoundary,
    highBGBoundary,
  }) {
    const { graphData, errorMessage } = await this.fetchGraphData({
      userId,
      noteDate,
      startDate,
      endDate,
      objectTypes,
      lowBGBoundary,
      highBGBoundary,
    })
      .then(response => ({
        graphData: response.graphData,
      }))
      .catch(error => ({
        errorMessage: error.message,
      }));

    return { graphData, errorMessage };
  }

  //
  // Lower-level promise-based methods
  //

  refreshToken({ sessionToken: previousSessionToken }) {
    const method = "get";
    const url = "/auth/login";
    const baseURL = this.baseUrl;
    const headers = { "x-tidepool-session-token": previousSessionToken };

    return new Promise((resolve, reject) => {
      axios({ method, url, baseURL, headers })
        .then(response => {
          this.sessionToken =
            response.headers["x-tidepool-session-token"] || "";
          this.userId = response.data.userid;

          if (this.sessionToken) {
            resolve({
              sessionToken: this.sessionToken,
              userId: this.userId,
            });
          } else {
            reject(
              new Error(
                "No x-tidepool-session-token was found in the response headers."
              )
            );
          }
        })
        .catch(error => {
          // console.log(`refreshToken error: ${error}`);
          if (
            error.response &&
            (error.response.status === 400 || error.response.status === 401)
          ) {
            reject(new Error("Unable to refresh token."));
          } else {
            reject(new Error("Check your Internet connection!"));
          }
        });
    });
  }

  signIn({ username, password }) {
    const method = "post";
    const url = "/auth/login";
    const baseURL = this.baseUrl;
    const trimmedUsername = username.trim();
    const auth = {
      username: trimmedUsername,
      password,
    };

    return new Promise((resolve, reject) => {
      axios({ method, url, baseURL, auth })
        .then(response => {
          this.sessionToken =
            response.headers["x-tidepool-session-token"] || "";
          this.userId = response.data.userid;

          if (this.sessionToken) {
            resolve({ sessionToken: this.sessionToken, userId: this.userId });
          } else {
            reject(
              new Error(
                "No x-tidepool-session-token was found in the response headers"
              )
            );
          }
        })
        .catch(error => {
          if (
            error.response &&
            (error.response.status === 400 || error.response.status === 401)
          ) {
            reject(new Error("Wrong email or password!"));
          } else {
            reject(new Error("Check your Internet connection!"));
          }
        });
    });
  }

  fetchProfile({ userId }) {
    const method = "get";
    const url = `/metadata/${userId}/profile`;
    const baseURL = this.baseUrl;
    const headers = { "x-tidepool-session-token": this.sessionToken };

    return new Promise((resolve, reject) => {
      axios({ method, url, baseURL, headers })
        .then(response => {
          resolve({ userId, ...response.data });
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  fetchProfileSettings({ userId }) {
    const method = "get";
    const url = `/metadata/${userId}/settings`;
    const baseURL = this.baseUrl;
    const headers = { "x-tidepool-session-token": this.sessionToken };

    return new Promise((resolve, reject) => {
      axios({ method, url, baseURL, headers })
        .then(({ data: { bgTarget } }) => {
          if (bgTarget && bgTarget.low && bgTarget.high) {
            const settings = {
              lowBGBoundary: bgTarget.low,
              highBGBoundary: bgTarget.high,
            };
            resolve({ settings });
          } else {
            reject(
              new Error(
                "No bgTarget was found in settings response data for user."
              )
            );
          }
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  fetchNotes({ userId }) {
    const method = "get";
    const url = `/message/notes/${userId}`;
    const baseURL = this.baseUrl;
    const headers = { "x-tidepool-session-token": this.sessionToken };

    return new Promise((resolve, reject) => {
      axios({ method, url, baseURL, headers })
        .then(response => {
          const notes = response.data.messages;
          resolve({ notes });
        })
        .catch(error => {
          if (error.response.status === 404) {
            // console.log(
            //   `fetchNotes: No notes retrieved, status code: ${
            //     error.response.status
            //   }, userid: ${userId}`
            // );
            resolve({ notes: [] });
          } else {
            reject(error);
          }
        });
    });
  }

  fetchComments({ messageId }) {
    const method = "get";
    const url = `/message/thread/${messageId}`;
    const baseURL = this.baseUrl;
    const headers = { "x-tidepool-session-token": this.sessionToken };

    return new Promise((resolve, reject) => {
      axios({ method, url, baseURL, headers })
        .then(response => {
          const comments = response.data.messages;
          resolve({ comments });
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  fetchOtherViewableUserIds({ userId }) {
    const method = "get";
    const url = `/access/groups/${userId}`;
    const baseURL = this.baseUrl;
    const headers = { "x-tidepool-session-token": this.sessionToken };

    return new Promise((resolve, reject) => {
      axios({ method, url, baseURL, headers })
        .then(response => {
          const userIds = Object.keys(response.data);

          // Remove userId, if exists, since we're only looking for other users
          const userIdIndex = userIds.indexOf(userId);
          if (userIdIndex !== -1) {
            userIds.splice(userIdIndex, 1);
          }

          resolve({ userIds });
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  addNote({ currentUser, currentProfile, messageText, timestamp }) {
    const method = "post";
    const groupId = currentProfile.userId;
    const url = `/message/send/${groupId}`;
    const baseURL = this.baseUrl;
    const headers = { "x-tidepool-session-token": this.sessionToken };
    const note = {
      groupId,
      parentMessage: null,
      userId: this.userId,
      timestamp,
      messageText,
      userFullName: currentUser.fullName,
    };

    return new Promise((resolve, reject) => {
      const data = {
        message: {
          groupid: note.groupId,
          parentmessage: note.parentMessage,
          guid: uuidv4(),
          userid: note.userId,
          timestamp: note.timestamp.toISOString(),
          messagetext: note.messageText,
        },
      };
      axios({ method, url, baseURL, headers, data })
        .then(response => {
          note.id = response.data.id;
          resolve({ note });
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  updateNote({ note }) {
    const method = "put";
    const url = `/message/edit/${note.id}`;
    const baseURL = this.baseUrl;
    const headers = { "x-tidepool-session-token": this.sessionToken };
    const data = {
      message: {
        timestamp: note.timestamp,
        messagetext: note.messageText,
      },
    };

    return new Promise((resolve, reject) => {
      axios({ method, url, baseURL, headers, data })
        .then(() => {
          resolve({});
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  addComment({ currentUser, currentProfile, note, messageText, timestamp }) {
    const method = "post";
    const groupId = currentProfile.userId;
    const url = `/message/reply/${note.id}`;
    const baseURL = this.baseUrl;
    const headers = { "x-tidepool-session-token": this.sessionToken };
    const comment = {
      groupId,
      parentMessage: note.id,
      userId: this.userId,
      timestamp,
      messageText,
      userFullName: currentUser.fullName,
    };

    return new Promise((resolve, reject) => {
      const data = {
        message: {
          groupid: comment.groupId,
          parentmessage: comment.parentMessage,
          guid: uuidv4(),
          userid: comment.userId,
          timestamp: comment.timestamp.toISOString(),
          messagetext: comment.messageText,
        },
      };
      axios({ method, url, baseURL, headers, data })
        .then(response => {
          comment.id = response.data.id;
          resolve({ comment });
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  updateComment({ comment }) {
    const method = "put";
    const url = `/message/edit/${comment.id}`;
    const baseURL = this.baseUrl;
    const headers = { "x-tidepool-session-token": this.sessionToken };
    const data = {
      message: {
        timestamp: comment.timestamp,
        messagetext: comment.messageText,
      },
    };

    return new Promise((resolve, reject) => {
      axios({ method, url, baseURL, headers, data })
        .then(() => {
          resolve({});
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  deleteCommentOrNote({ id }) {
    const method = "delete";
    const url = `/message/remove/${id}`;
    const baseURL = this.baseUrl;
    const headers = { "x-tidepool-session-token": this.sessionToken };

    return new Promise((resolve, reject) => {
      axios({ method, url, baseURL, headers })
        .then(() => {
          resolve({});
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  fetchGraphData({
    userId,
    noteDate,
    startDate,
    endDate,
    objectTypes,
    lowBGBoundary,
    highBGBoundary,
  }) {
    const method = "get";
    const url = `/data/${userId}`;
    const params = {
      endDate: endDate.toISOString(),
      startDate: startDate.toISOString(),
      type: objectTypes,
    };
    const baseURL = this.baseUrl;
    const headers = { "x-tidepool-session-token": this.sessionToken };

    return new Promise((resolve, reject) => {
      axios({ method, url, params, baseURL, headers })
        .then(response => {
          const noteTimeSeconds = noteDate.getTime() / 1000;
          const startDateSeconds = startDate.getTime() / 1000;
          const endDateSeconds = endDate.getTime() / 1000;
          const graphData = new GraphData();
          graphData.addResponseData(response.data);
          graphData.process({
            eventTimeSeconds: noteTimeSeconds,
            timeIntervalSeconds: endDateSeconds - startDateSeconds,
            lowBGBoundary,
            highBGBoundary,
          });
          resolve({ graphData });
        })
        .catch(error => {
          reject(error);
        });
    });
  }
  /*
    func getReadOnlyUserData(_ startDate: Date? = nil, endDate: Date? = nil, objectTypes: String = "smbg,bolus,cbg,wizard,basal", completion: @escaping (Result<JSON>) -> (Void)) {
        // Set our endpoint for the user data
        // TODO: centralize define of read-only events!
        // request format is like: https://api.tidepool.org/data/f934a287c4?endDate=2015-11-17T08%3A00%3A00%2E000Z&startDate=2015-11-16T12%3A00%3A00%2E000Z&type=smbg%2Cbolus%2Ccbg%2Cwizard%2Cbasal
        let userId = TidepoolMobileDataController.sharedInstance.currentViewedUser!.userid
        let endpoint = "data/" + userId
        UIApplication.shared.isNetworkActivityIndicatorVisible = true
        DDLogInfo("getReadOnlyUserData request start")
        // TODO: If there is no data returned, I get a failure case with status code 200, and error FAILURE: Error Domain=NSCocoaErrorDomain Code=3840 "Invalid value around character 0." UserInfo={NSDebugDescription=Invalid value around character 0.} ] Maybe an Alamofire issue?
        var parameters: Dictionary = ["type": objectTypes]
        if let startDate = startDate {
            // NOTE: start date is excluded (i.e., dates > start date)
            parameters.updateValue(TidepoolMobileUtils.dateToJSON(startDate), forKey: "startDate")
        }
        if let endDate = endDate {
            // NOTE: end date is included (i.e., dates <= end date)
            parameters.updateValue(TidepoolMobileUtils.dateToJSON(endDate), forKey: "endDate")
        }
        sendRequest(.get, endpoint: endpoint, parameters: parameters as [String : AnyObject]?).responseJSON { response in
            UIApplication.shared.isNetworkActivityIndicatorVisible = false
            DDLogInfo("getReadOnlyUserData request complete")
            if (response.result.isSuccess) {
                let json = JSON(response.result.value!)
                var validResult = true
                if let status = json["status"].number {
                    let statusCode = Int(status)
                    DDLogInfo("getReadOnlyUserData includes status field: \(statusCode)")
                    // TODO: determine if any status is indicative of failure here! Note that if call was successful, there will be no status field in the json result. The only verified error response is 403 which happens when we pass an invalid token.
                    if statusCode == 401 || statusCode == 403 {
                        validResult = false
                        self.lastNetworkError = statusCode
                        completion(Result.failure(NSError(domain: self.kTidepoolMobileErrorDomain,
                            code: statusCode,
                            userInfo: nil)))
                    }
                }
                if validResult {
                    completion(Result.success(json))
                }
            } else {
                // Failure: typically, no data were found:
                // Error Domain=NSCocoaErrorDomain Code=3840 "Invalid value around character 0." UserInfo={NSDebugDescription=Invalid value around character 0.}
                if let theResponse = response.response {
                    let statusCode = theResponse.statusCode
                    if statusCode != 200 {
                        DDLogError("Failure status code: \(statusCode) for getReadOnlyUserData")
                        APIConnector.connector().trackMetric("Tidepool Data Fetch Failure - Code " + String(statusCode))
                    }
                    // Otherwise, just indicates no data were found...
                } else {
                    DDLogError("Invalid response for getReadOnlyUserData metric")
                }
                completion(Result.failure(response.result.error!))
            }
        }
    }

  */
}

export default TidepoolApi;
