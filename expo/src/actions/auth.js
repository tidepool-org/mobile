import { navigateHome, navigateSignIn } from "../actions/navigation";
import api from "../api";

export const AUTH_SIGN_IN_RESET = "AUTH_SIGN_IN_RESET";
export const AUTH_SIGN_IN_DID_START = "AUTH_SIGN_IN_DID_START";
export const AUTH_SIGN_IN_DID_SUCCEED = "AUTH_SIGN_IN_DID_SUCCEED";
export const AUTH_SIGN_IN_DID_FAIL = "AUTH_SIGN_IN_DID_FAIL";

export const authSignInDidStart = () => ({
  type: AUTH_SIGN_IN_DID_START,
});

export const authSignInDidSucceed = ({ sessionToken, username }) => ({
  type: AUTH_SIGN_IN_DID_SUCCEED,
  payload: { sessionToken, username },
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

  const { sessionToken, errorMessage } = await api()
    .signIn({
      username,
      password,
    })
    .then(sessionTokenResponse => ({
      sessionToken: sessionTokenResponse,
      errorMessage: "",
    }))
    .catch(errorResponse => ({
      sessionToken: "",
      errorMessage: errorResponse.message,
    }));

  if (sessionToken) {
    dispatch(authSignInDidSucceed({ sessionToken, username }));
    dispatch(navigateHome());
  } else {
    dispatch(authSignInDidFail(errorMessage));
  }
};
