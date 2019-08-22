// TODO: api - use secure storage for session token

import {
  AUTH_SIGN_IN_RESET,
  AUTH_SIGN_IN_DID_START,
  AUTH_SIGN_IN_DID_SUCCEED,
  AUTH_SIGN_IN_DID_FAIL,
  AUTH_REFRESH_SESSION_TOKEN_DID_SUCCEED,
  AUTH_REFRESH_SESSION_TOKEN_DID_FAIL,
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
      nextState = {
        ...action.payload,
        signingIn: false,
        errorMessage: "",
      };
      break;
    }
    case AUTH_SIGN_IN_DID_FAIL: {
      nextState = {
        ...state,
        signingIn: false,
        sessionToken: "",
        errorMessage: action.payload,
      };
      break;
    }
    case AUTH_REFRESH_SESSION_TOKEN_DID_SUCCEED: {
      nextState = {
        ...action.payload,
        signingIn: false,
        errorMessage: "",
      };
      break;
    }
    case AUTH_REFRESH_SESSION_TOKEN_DID_FAIL: {
      nextState = {
        ...state,
        signingIn: false,
        sessionToken: "",
        errorMessage: "",
      };
      break;
    }
    default:
      break;
  }

  return nextState;
}

export default auth;
