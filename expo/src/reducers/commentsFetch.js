import {
  COMMENTS_FETCH_DID_START,
  COMMENTS_FETCH_DID_SUCCEED,
  COMMENTS_FETCH_DID_FAIL,
  COMMENTS_FETCH_ADD_COMMENT,
} from "../actions/commentsFetch";
import { AUTH_SIGN_IN_RESET } from "../actions/auth";
import { NOTES_FETCH_DID_START } from "../actions/notesFetch";

const initialState = {};

function commentsFetch(state = initialState, action) {
  let nextState = state;

  switch (action.type) {
    case AUTH_SIGN_IN_RESET:
    case NOTES_FETCH_DID_START: // Also reset to initial state if a refresh of notes list starts
      nextState = initialState;
      break;
    case COMMENTS_FETCH_DID_START: {
      const { messageId } = action.payload;
      nextState = {
        ...state,
        [messageId]: {
          comments: [],
          errorMessage: "",
          fetching: true,
        },
      };
      break;
    }
    case COMMENTS_FETCH_DID_SUCCEED: {
      const { messageId, comments } = action.payload;
      nextState = {
        ...state,
        [messageId]: {
          comments,
          errorMessage: "",
          fetching: false,
          fetched: true,
        },
      };
      break;
    }
    case COMMENTS_FETCH_DID_FAIL: {
      const { messageId, errorMessage } = action.payload;
      nextState = {
        ...state,
        [messageId]: {
          comments: [],
          errorMessage,
          fetching: false,
          fetched: false,
        },
      };
      break;
    }
    case COMMENTS_FETCH_ADD_COMMENT: {
      const { note } = action.payload;
      // Add the comment
      const sortedComments = [
        ...state[note.id].comments,
        action.payload.comment,
      ];
      // Sort comments chronologically by timestamp
      sortedComments.sort(
        (comment1, comment2) => comment1.timestamp - comment2.timestamp
      );
      nextState = {
        ...state,
        [note.id]: {
          comments: sortedComments,
        },
      };
      break;
    }
    default:
      break;
  }

  return nextState;
}

export default commentsFetch;
