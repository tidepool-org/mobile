import { profileSetCurrentProfile } from "../actions/profile";
import { navigateHome, navigateSignIn } from "../actions/navigation";
import api from "../api";

export const AUTH_SIGN_IN_RESET = "AUTH_SIGN_IN_RESET";
export const AUTH_SIGN_IN_DID_START = "AUTH_SIGN_IN_DID_START";
export const AUTH_SIGN_IN_DID_SUCCEED = "AUTH_SIGN_IN_DID_SUCCEED";
export const AUTH_SIGN_IN_DID_FAIL = "AUTH_SIGN_IN_DID_FAIL";

export const authSignInDidStart = () => ({
  type: AUTH_SIGN_IN_DID_START,
});

export const authSignInDidSucceed = ({
  sessionToken,
  userId,
  username,
  fullName,
}) => ({
  type: AUTH_SIGN_IN_DID_SUCCEED,
  payload: { sessionToken, userId, username, fullName },
});

export const authSignInDidFail = errorMessage => ({
  type: AUTH_SIGN_IN_DID_FAIL,
  payload: errorMessage,
});

export const authSignInReset = () => ({
  type: AUTH_SIGN_IN_RESET,
});

export const authSignOutAsync = () => async dispatch => {
  dispatch(authSignInReset());
  dispatch(navigateSignIn());
};

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
      dispatch(
        authSignInDidSucceed({ sessionToken, userId, username, fullName }),
      );
      dispatch(profileSetCurrentProfile({ userId, fullName }));
      dispatch(navigateHome());
    }
  }
};
