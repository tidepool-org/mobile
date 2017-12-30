import { AsyncStorage } from "react-native";
import { profileRestoreAndSetAsync } from "../actions/profile";
import { navigateHome, navigateSignIn } from "../actions/navigation";
import api from "../api";

export const AUTH_SIGN_IN_RESET = "AUTH_SIGN_IN_RESET";
export const AUTH_SIGN_IN_DID_START = "AUTH_SIGN_IN_DID_START";
export const AUTH_SIGN_IN_DID_SUCCEED = "AUTH_SIGN_IN_DID_SUCCEED";
export const AUTH_SIGN_IN_DID_FAIL = "AUTH_SIGN_IN_DID_FAIL";
export const AUTH_REFRESH_SESSION_TOKEN_DID_START =
  "AUTH_REFRESH_SESSION_TOKEN_DID_START";
export const AUTH_REFRESH_SESSION_TOKEN_DID_SUCCEED =
  "AUTH_REFRESH_SESSION_TOKEN_DID_SUCCEED";
export const AUTH_REFRESH_SESSION_TOKEN_DID_FAIL =
  "AUTH_REFRESH_SESSION_TOKEN_DID_FAIL";

const AUTH_USER_KEY = "AUTH_USER_KEY";

export const authSignInReset = () => ({
  type: AUTH_SIGN_IN_RESET,
});

export const authSignOutAsync = () => async dispatch => {
  try {
    await AsyncStorage.removeItem(AUTH_USER_KEY);
  } catch (error) {
    // console.log(
    //   `authSignOutAsync: failed to remove auth token on sign out, error:${error}`
    // );
  }

  dispatch(authSignInReset());
  dispatch(navigateSignIn());
};

export const authSignInDidStart = () => ({
  type: AUTH_SIGN_IN_DID_START,
});

export const authSignInDidSucceed = ({
  authUser: { sessionToken, userId, username, fullName },
}) => ({
  type: AUTH_SIGN_IN_DID_SUCCEED,
  payload: { sessionToken, userId, username, fullName },
});

export const authSignInDidFail = errorMessage => ({
  type: AUTH_SIGN_IN_DID_FAIL,
  payload: errorMessage,
});

export const authSignInAsync = ({ username, password }) => async dispatch => {
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
        await AsyncStorage.setItem(AUTH_USER_KEY, JSON.stringify(authUser));
        dispatch(authSignInDidSucceed({ authUser }));
        await dispatch(profileRestoreAndSetAsync({ authUser }));
        dispatch(navigateHome());
      } catch (error) {
        dispatch(authSignInDidFail(error.errorMessage));
      }
    }
  }
};

export const authRefreshTokenDidStart = () => ({
  type: AUTH_REFRESH_SESSION_TOKEN_DID_START,
});

export const authRefreshTokenDidSucceed = ({
  authUser: { sessionToken, userId, username, fullName },
}) => ({
  type: AUTH_REFRESH_SESSION_TOKEN_DID_SUCCEED,
  payload: { sessionToken, userId, username, fullName },
});

export const authRefreshTokenDidFail = errorMessage => ({
  type: AUTH_REFRESH_SESSION_TOKEN_DID_FAIL,
  payload: errorMessage,
});

export const authRefreshTokenOrSignInAsync = () => async dispatch => {
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
      await dispatch(profileRestoreAndSetAsync({ authUser }));
      dispatch(navigateHome());
    }
  }
};
