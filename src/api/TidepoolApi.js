import axios from "axios";
import uuidv4 from "uuid/v4";
import parse from "date-fns/parse";
import DeviceInfo from "react-native-device-info";
import ConnectionStatus from "../models/ConnectionStatus";
import {
  MMOL_PER_L_TO_MG_PER_DL,
  UNITS_MMOL_PER_L,
} from "../components/Graph/helpers";
import GraphData from "../models/GraphData";
import { TidepoolApiCache } from "./TidepoolApiCache";

// TODO: api - update User-Agent in the header for all requests to indicate the app name and version, build info,
// iOS version, etc, similar to Tidepool Mobile, e.g.:
// "Nutshell/2.0.3 (org.tidepool.blipnotes; build:460; iOS 11.1.0) Alamofire/4.3.0")
// "Nutshell/460 CFNetwork/889.9 Darwin/17.2.0"

const timeout = 30000;

class TidepoolApi {
  constructor({ baseUrl }) {
    this.baseUrl = baseUrl;
    this.sessionToken = "";
  }

  //
  // Async helpers
  //

  async refreshTokenAsync(authUser) {
    if (ConnectionStatus.isOffline()) {
      return authUser;
    }

    const { sessionToken: previousSessionToken } = authUser;
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

    this.sessionToken = sessionToken;

    return { sessionToken, userId, errorMessage };
  }

  async signInAsync({ username, password }) {
    if (ConnectionStatus.isOffline()) {
      return { errorMessage: "Check your Internet connection!" };
    }

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

    this.sessionToken = sessionToken;

    return { sessionToken, userId, errorMessage };
  }

  async fetchProfileAsync({ userId }) {
    if (ConnectionStatus.isOffline()) {
      return TidepoolApiCache.fetchProfileAsync({ userId });
    }

    const { errorMessage, ...rest } = await this.fetchProfile({
      userId,
    })
      .then(response => {
        const profile = response;
        TidepoolApiCache.saveProfileAsync({ userId, profile });
        return {
          profile,
        };
      })
      .catch(error => ({
        errorMessage: error.message,
      }));

    return { userId, ...rest, errorMessage };
  }

  async fetchProfileSettingsAsync({ userId }) {
    if (ConnectionStatus.isOffline()) {
      return TidepoolApiCache.fetchProfileSettingsAsync({ userId });
    }

    const { settings, errorMessage } = await this.fetchProfileSettings({
      userId,
    })
      .then(response => {
        TidepoolApiCache.saveProfileSettingsAsync({
          userId,
          settings: response.settings,
        });
        return {
          settings: response.settings,
        };
      })
      .catch(error => ({
        errorMessage: error.message,
      }));

    return { settings, errorMessage };
  }

  async fetchNotesAsync({ userId }) {
    if (ConnectionStatus.isOffline()) {
      return TidepoolApiCache.fetchNotesAsync({ userId });
    }

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

        TidepoolApiCache.saveNotesAsync({ userId, notes: sortedNotes });
        return { notes: sortedNotes };
      })
      .catch(error => ({
        errorMessage: error.message,
      }));

    return { notes, errorMessage };
  }

  async fetchCommentsAsync({ messageId }) {
    if (ConnectionStatus.isOffline()) {
      return TidepoolApiCache.fetchCommentsAsync({ messageId });
    }

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

        TidepoolApiCache.saveCommentsAsync({
          messageId,
          comments: sortedComments,
        });

        return { comments: sortedComments };
      })
      .catch(error => ({
        errorMessage: error.message,
      }));

    return { comments, errorMessage };
  }

  async fetchViewableUserProfilesAsync({ userId, fullName }) {
    if (ConnectionStatus.isOffline()) {
      return TidepoolApiCache.fetchViewableUserProfilesAsync({
        userId,
      });
    }

    let errorMessage;
    let profiles = [];

    // Get other viewable user ids
    const {
      userIds,
      errorMessage: fetchOtherViewableUserIdsErrorMessage,
    } = await this.fetchOtherViewableUserIds({
      userId,
    })
      .then(response => {
        return {
          userIds: response.userIds,
        };
      })
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

    TidepoolApiCache.saveViewableUserProfilesAsync({
      userId,
      profiles: viewableUserProfiles,
    });

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
    let result;

    if (ConnectionStatus.isOffline()) {
      result = await TidepoolApiCache.fetchGraphDataAsync({
        userId,
        noteDate,
        startDate,
        endDate,
      });
    } else {
      result = await this.fetchGraphData({
        userId,
        noteDate,
        startDate,
        endDate,
        objectTypes,
        lowBGBoundary,
        highBGBoundary,
      })
        .then(responseData => {
          return {
            responseData,
          };
        })
        .catch(error => {
          // console.log({ error });
          return {
            errorMessage: error.message,
          };
        });
    }

    let graphData;
    const { responseData, errorMessage } = result;
    if (responseData) {
      // console.log({ responseData });
      const noteTimeSeconds = noteDate.getTime() / 1000;
      const startDateSeconds = startDate.getTime() / 1000;
      const endDateSeconds = endDate.getTime() / 1000;
      graphData = new GraphData();
      graphData.addResponseData(responseData);
      graphData.process({
        eventTimeSeconds: noteTimeSeconds,
        timeIntervalSeconds: endDateSeconds - startDateSeconds,
        lowBGBoundary,
        highBGBoundary,
      });

      if (!ConnectionStatus.isOffline()) {
        TidepoolApiCache.saveGraphDataAsync({
          userId,
          noteDate,
          startDate,
          endDate,
          responseData,
        });
      }
    } else {
      graphData = new GraphData();
    }

    return { graphData, errorMessage };
  }

  async trackMetricAsync({ metric }) {
    const { errorMessage } = await this.trackMetric({
      metric,
    })
      .then(() => ({}))
      .catch(error => ({
        errorMessage: error.message,
      }));

    return { errorMessage };
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
      axios({ method, url, baseURL, headers, timeout })
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
      axios({ method, url, baseURL, auth, timeout })
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
      axios({ method, url, baseURL, headers, timeout })
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
      axios({ method, url, baseURL, headers, timeout })
        .then(({ data: { bgTarget, units } }) => {
          if (bgTarget && bgTarget.low && bgTarget.high) {
            const shouldConvertToMgPerDl =
              units && units.bg === UNITS_MMOL_PER_L;
            const settings = {
              lowBGBoundary: shouldConvertToMgPerDl
                ? Math.round(bgTarget.low * MMOL_PER_L_TO_MG_PER_DL)
                : bgTarget.low,
              highBGBoundary: shouldConvertToMgPerDl
                ? Math.round(bgTarget.high * MMOL_PER_L_TO_MG_PER_DL)
                : bgTarget.high,
              units: units ? units.bg : undefined,
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
      axios({ method, url, baseURL, headers, timeout })
        .then(response => {
          const notes = response.data.messages;
          resolve({ notes });
        })
        .catch(error => {
          if (error.response && error.response.status === 404) {
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
      axios({ method, url, baseURL, headers, timeout })
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
      axios({ method, url, baseURL, headers, timeout })
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
      axios({ method, url, baseURL, headers, data, timeout })
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
      axios({ method, url, baseURL, headers, data, timeout })
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
      axios({ method, url, baseURL, headers, data, timeout })
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
      axios({ method, url, baseURL, headers, data, timeout })
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
      axios({ method, url, baseURL, headers, timeout })
        .then(() => {
          resolve({});
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  fetchGraphData({ userId, startDate, endDate, objectTypes }) {
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
      axios({ method, url, params, baseURL, headers, timeout })
        .then(response => {
          // Omit extra properties from response data. This would otherwise
          // bloat the cached data, and, for some objects that have dots in key
          // names, would throw exception when saving in db. This whitelisted
          // response data is a superset of all the data for all the available
          // types in the data array
          let whitelistedResponseData = [];
          if (response.data && response.data.length > 0) {
            whitelistedResponseData = response.data.map(item => {
              return {
                // Common
                id: item.id,
                type: item.type,
                time: item.time,
                value: item.value,
                // Basal
                rate: item.rate,
                deliveryType: item.deliveryType,
                duration: item.duration,
                suppressed: item.suppressed,
                // Bolus
                normal: item.normal,
                extended: item.extended,
                //  duration, // Bolus and Basal share this
                expectedNormal: item.expectedNormal,
                expectedExtended: item.expectedExtended,
                expectedDuration: item.expectedDuration,
                // Wizard
                bolus: item.bolus,
                carbInput: item.carbInput,
                recommended: item.recommended,
                // Food
                nutrition: item.nutrition,
              };
            });
          }
          resolve(whitelistedResponseData);
        })
        .catch(error => {
          // console.log({ error });
          reject(error);
        });
    });
  }

  trackMetric({ metric }) {
    const method = "get";
    const url = `/metrics/thisuser/tidepool-${metric}`;
    const baseURL = this.baseUrl;
    const headers = { "x-tidepool-session-token": this.sessionToken };
    let sourceVersion = "3.0 (Expo)";
    try {
      sourceVersion = `${DeviceInfo.getSystemName()} ${DeviceInfo.getVersion()} (${DeviceInfo.getBuildNumber()})`;
    } catch (error) {
      // console.log(
      //   `Failed to get DeviceInfo version, defaulting to ${version}, error: ${error}`
      // );
    }
    const params = {
      source: "tidepool",
      sourceVersion,
    };

    return new Promise((resolve, reject) => {
      axios({ method, url, baseURL, headers, params, timeout })
        .then(() => {
          // console.log(`trackMetric succeeded with metric: ${metric}`);
          resolve();
        })
        .catch(error => {
          // console.log(`trackMetric error: ${error}, with metric: ${metric}`);
          reject(error);
        });
    });
  }
}

export { TidepoolApi };
