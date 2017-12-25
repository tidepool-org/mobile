import {
  PROFILES_FETCH_DID_START,
  PROFILES_FETCH_DID_SUCCEED,
  PROFILES_FETCH_DID_FAIL,
} from "../actions/profilesFetch";
import { AUTH_SIGN_IN_RESET } from "../actions/auth";

const initialState = {
  userId: "",
  profiles: [],
  errorMessage: "",
  fetching: false,
};

function profilesFetch(state = initialState, action) {
  let nextState = state;

  switch (action.type) {
    case AUTH_SIGN_IN_RESET:
      nextState = initialState;
      break;
    case PROFILES_FETCH_DID_START: {
      nextState = {
        userId: action.payload.userId,
        profiles: [],
        errorMessage: "",
        fetching: true,
      };
      break;
    }
    case PROFILES_FETCH_DID_SUCCEED: {
      nextState = {
        userId: action.payload.userId,
        profiles: action.payload.profiles,
        errorMessage: "",
        fetching: false,
      };
      break;
    }
    case PROFILES_FETCH_DID_FAIL: {
      nextState = {
        userId: action.payload.userId,
        profiles: [],
        errorMessage: action.payload.errorMessage,
        fetching: false,
      };
      break;
    }
    default:
      break;
  }

  return nextState;
}

export default profilesFetch;
