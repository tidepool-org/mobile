import axios from "axios";
import uuidv4 from "uuid/v4";

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
    const { fullName, errorMessage } = await this.fetchProfile({
      userId,
    })
      .then(response => ({
        fullName: response.fullName,
      }))
      .catch(error => ({
        errorMessage: error.message,
      }));

    return { userId, fullName, errorMessage };
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
            timestamp: new Date(new Date(responseNote.timestamp)),
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
            timestamp: new Date(new Date(responseComment.timestamp)),
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
          const profile = response.data;
          const { fullName } = profile;
          resolve({ userId, fullName });
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
          reject(error);
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
}

export default TidepoolApi;
