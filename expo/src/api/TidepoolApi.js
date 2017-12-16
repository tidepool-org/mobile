import axios from "axios";

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

    return { fullName, errorMessage };
  }

  //
  // Lower-level promise-based methods
  //

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
          const userId = response.data.userid;

          if (this.sessionToken) {
            resolve({ sessionToken: this.sessionToken, userId });
          } else {
            reject(
              new Error(
                "No x-tidepool-session-token was found in the response headers",
              ),
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
          resolve({ fullName });
        })
        .catch(error => {
          reject(error);
        });
    });
  }
}

export default TidepoolApi;
