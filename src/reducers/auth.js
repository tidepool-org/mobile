// TODO: api - use secure storage for session token

import {
  AUTH_SIGN_IN_RESET,
  AUTH_SIGN_IN_DID_START,
  AUTH_SIGN_IN_DID_SUCCEED,
  AUTH_SIGN_IN_DID_FAIL,
  AUTH_REFRESH_SESSION_TOKEN_DID_SUCCEED,
} from "../actions/auth";

const initialState = {
  sessionToken: "",
  userId: "",
  username: "",
  fullName: "",
  signingIn: false,
  errorMessage: "",
};

function auth(state = initialState, action) {
  let nextState = state;

  switch (action.type) {
    case AUTH_SIGN_IN_RESET:
      nextState = initialState;
      break;
    case AUTH_SIGN_IN_DID_START:
      nextState = { ...state, signingIn: true };
      break;
    case AUTH_SIGN_IN_DID_SUCCEED: {
      const { sessionToken, userId, username, fullName } = action.payload;
      nextState = {
        sessionToken,
        userId,
        username,
        fullName,
        signingIn: false,
        errorMessage: "",
      };
      break;
    }
    case AUTH_REFRESH_SESSION_TOKEN_DID_SUCCEED: {
      const { sessionToken, userId, username, fullName } = action.payload;
      nextState = {
        sessionToken,
        userId,
        username,
        fullName,
        signingIn: false,
        errorMessage: "",
      };
      break;
    }
    case AUTH_SIGN_IN_DID_FAIL: {
      nextState = {
        ...state,
        signingIn: false,
        errorMessage: action.payload,
      };
      break;
    }
    default:
      break;
  }

  return nextState;
}

export default auth;
