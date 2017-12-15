import axios from "axios";

// TODO: api - handle baseURL with debug environment settings
// TODO: api - default timeout for requests?

class TidepoolApi {
  constructor({ baseUrl }) {
    this.baseUrl = baseUrl;
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
          const sessionToken = response.headers["x-tidepool-session-token"];
          if (sessionToken) {
            resolve(sessionToken);
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
}

export default TidepoolApi;
