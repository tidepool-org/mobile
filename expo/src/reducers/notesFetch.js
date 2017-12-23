import {
  NOTES_FETCH_DID_START,
  NOTES_FETCH_DID_SUCCEED,
  NOTES_FETCH_DID_FAIL,
} from "../actions/notesFetch";

const initialAuthState = {
  userId: "",
  notes: [],
  errorMessage: "",
  fetching: false,
};

function notesFetch(state = initialAuthState, action) {
  switch (action.type) {
    case NOTES_FETCH_DID_START: {
      return {
        ...state,
        userId: action.payload.userId,
        errorMessage: "",
        fetching: true,
      };
    }
    case NOTES_FETCH_DID_SUCCEED: {
      return {
        userId: action.payload.userId,
        notes: action.payload.notes,
        errorMessage: "",
        fetching: false,
      };
    }
    case NOTES_FETCH_DID_FAIL: {
      return {
        ...state,
        userId: action.payload.userId,
        errorMessage: action.payload.errorMessage,
        fetching: false,
      };
    }
    default:
      return state;
  }
}

export default notesFetch;
