import {
  NOTES_FETCH_DID_START,
  NOTES_FETCH_DID_SUCCEED,
  NOTES_FETCH_DID_FAIL,
} from "../actions/notesFetch";
import { AUTH_SIGN_IN_RESET } from "../actions/auth";

const initialState = {
  userId: "",
  notes: [],
  errorMessage: "",
  fetching: false,
};

function notesFetch(state = initialState, action) {
  let nextState = state;

  switch (action.type) {
    case AUTH_SIGN_IN_RESET:
      nextState = initialState;
      break;
    case NOTES_FETCH_DID_START: {
      nextState = {
        userId: action.payload.profile.userId,
        notes: [],
        errorMessage: "",
        fetching: true,
      };
      break;
    }
    case NOTES_FETCH_DID_SUCCEED: {
      nextState = {
        userId: action.payload.profile.userId,
        notes: action.payload.notes,
        errorMessage: "",
        fetching: false,
      };
      break;
    }
    case NOTES_FETCH_DID_FAIL: {
      nextState = {
        userId: action.payload.profile.userId,
        notes: [],
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

export default notesFetch;
