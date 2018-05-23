import { AsyncStorage } from "react-native";
import { currentProfileRestoreAsync } from "../actions/currentProfile";
import { navigateHome, navigateSignIn } from "../actions/navigation";
import api from "../api";

const AUTH_SIGN_IN_RESET = "AUTH_SIGN_IN_RESET";
const AUTH_SIGN_IN_DID_START = "AUTH_SIGN_IN_DID_START";
const AUTH_SIGN_IN_DID_SUCCEED = "AUTH_SIGN_IN_DID_SUCCEED";
const AUTH_SIGN_IN_DID_FAIL = "AUTH_SIGN_IN_DID_FAIL";
const AUTH_REFRESH_SESSION_TOKEN_DID_START =
  "AUTH_REFRESH_SESSION_TOKEN_DID_START";
const AUTH_REFRESH_SESSION_TOKEN_DID_SUCCEED =
  "AUTH_REFRESH_SESSION_TOKEN_DID_SUCCEED";
const AUTH_REFRESH_SESSION_TOKEN_DID_FAIL =
  "AUTH_REFRESH_SESSION_TOKEN_DID_FAIL";

const AUTH_USER_KEY = "AUTH_USER_KEY";

const authSignInReset = () => ({
  type: AUTH_SIGN_IN_RESET,
});

const authSignOutAsync = () => async dispatch => {
  try {
    AsyncStorage.removeItem(AUTH_USER_KEY);
  } catch (error) {
    // console.log(
    //   `authSignOutAsync: failed to remove auth token on sign out, error:${error}`
    // );
  }

  dispatch(authSignInReset());
  dispatch(navigateSignIn());
};

const authSignInDidStart = () => ({
  type: AUTH_SIGN_IN_DID_START,
});

const authSignInDidSucceed = ({
  authUser: { sessionToken, userId, username, fullName },
}) => ({
  type: AUTH_SIGN_IN_DID_SUCCEED,
  payload: { sessionToken, userId, username, fullName },
});

const authSignInDidFail = errorMessage => ({
  type: AUTH_SIGN_IN_DID_FAIL,
  payload: errorMessage,
});

const authSignInAsync = ({ username, password }) => async dispatch => {
  dispatch(authSignInDidStart());

  const {
    sessionToken,
    userId,
    errorMessage: signInErrorMessage,
  } = await api().signInAsync({
    username,
    password,
  });

  if (!sessionToken) {
    // console.log(`authSignInAsync: Error: ${errorMessage}`)
    dispatch(authSignInDidFail(signInErrorMessage));
  } else {
    const {
      fullName,
      errorMessage: fetchProfileErrorMessage,
    } = await api().fetchProfileAsync({
      userId,
    });

    if (fetchProfileErrorMessage) {
      dispatch(authSignInDidFail(fetchProfileErrorMessage));
    } else {
      const authUser = { sessionToken, userId, username, fullName };
      try {
        AsyncStorage.setItem(AUTH_USER_KEY, JSON.stringify(authUser));
        dispatch(authSignInDidSucceed({ authUser }));
        await dispatch(currentProfileRestoreAsync({ authUser }));
        dispatch(navigateHome());
      } catch (error) {
        dispatch(authSignInDidFail(error.errorMessage));
      }
    }
  }
};

const authRefreshTokenDidStart = () => ({
  type: AUTH_REFRESH_SESSION_TOKEN_DID_START,
});

const authRefreshTokenDidSucceed = ({
  authUser: { sessionToken, userId, username, fullName },
}) => ({
  type: AUTH_REFRESH_SESSION_TOKEN_DID_SUCCEED,
  payload: { sessionToken, userId, username, fullName },
});

const authRefreshTokenDidFail = errorMessage => ({
  type: AUTH_REFRESH_SESSION_TOKEN_DID_FAIL,
  payload: errorMessage,
});

const authRefreshTokenOrSignInAsync = () => async dispatch => {
  dispatch(authRefreshTokenDidStart());

  let authUser = {};
  try {
    authUser = JSON.parse(await AsyncStorage.getItem(AUTH_USER_KEY)) || {};
  } catch (error) {
    // console.log(`authRefreshTokenOrSignInAsync: error: ${error}`);
  }

  if (!authUser.sessionToken) {
    // console.log(
    //   "authRefreshTokenOrSignInAsync: No session token exists, navigate to sign in"
    // );

    dispatch(authRefreshTokenDidSucceed({ authUser }));
    dispatch(authSignInReset());
    dispatch(navigateSignIn());
  } else {
    // console.log("authRefreshTokenOrSignInAsync: We have a session token");

    const {
      sessionToken,
      userId,
      errorMessage,
    } = await api().refreshTokenAsync(authUser);

    if (errorMessage) {
      // console.log(`authRefreshTokenOrSignInAsync: Error: ${errorMessage}`);
      dispatch(authRefreshTokenDidFail(errorMessage));

      // console.log(
      //   `authRefreshTokenOrSignInAsync: Navigate to sign in due to error`
      // ); // TODO: sign in - what about client side errors? Those should not result in reset / sign in
      dispatch(authSignInReset());
      dispatch(navigateSignIn());
    } else {
      // console.log(`authRefreshTokenOrSignInAsync: Success!`);
      authUser.sessionToken = sessionToken;
      authUser.userId = userId;
      dispatch(authRefreshTokenDidSucceed({ authUser }));
      await dispatch(currentProfileRestoreAsync({ authUser }));
      dispatch(navigateHome());
    }
  }
};

export {
  authSignInReset,
  authSignOutAsync,
  authSignInDidStart,
  authSignInDidSucceed,
  authSignInDidFail,
  authSignInAsync,
  authRefreshTokenDidStart,
  authRefreshTokenDidSucceed,
  authRefreshTokenDidFail,
  authRefreshTokenOrSignInAsync,
  AUTH_SIGN_IN_RESET,
  AUTH_SIGN_IN_DID_START,
  AUTH_SIGN_IN_DID_SUCCEED,
  AUTH_SIGN_IN_DID_FAIL,
  AUTH_REFRESH_SESSION_TOKEN_DID_START,
  AUTH_REFRESH_SESSION_TOKEN_DID_SUCCEED,
  AUTH_REFRESH_SESSION_TOKEN_DID_FAIL,
};
