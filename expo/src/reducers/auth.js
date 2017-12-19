// TODO: api - store sessionToken in async storage, and on startup, try to use that first to bypass sign in screen
// TODO: api - refresh token support
// TODO: api - use secure storage for session token

import {
  AUTH_SIGN_IN_RESET,
  AUTH_SIGN_IN_DID_START,
  AUTH_SIGN_IN_DID_SUCCEED,
  AUTH_SIGN_IN_DID_FAIL,
} from "../actions/auth";

const initialAuthState = {
  sessionToken: "",
  userId: "",
  username: "",
  fullName: "",
  signingIn: false,
  errorMessage: "",
};

function auth(state = initialAuthState, action) {
  switch (action.type) {
    case AUTH_SIGN_IN_RESET:
      return initialAuthState;
    case AUTH_SIGN_IN_DID_START:
      return { ...state, signingIn: true };
    case AUTH_SIGN_IN_DID_SUCCEED: {
      const { sessionToken, userId, username, fullName } = action.payload;
      return {
        ...state,
        sessionToken,
        userId,
        username,
        fullName,
        signingIn: false,
        errorMessage: "",
      };
    }
    case AUTH_SIGN_IN_DID_FAIL: {
      return {
        ...state,
        signingIn: false,
        errorMessage: action.payload,
      };
    }
    default:
      return state;
  }
}

export default auth;
