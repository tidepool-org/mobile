import {
  COMMENTS_FETCH_DID_START,
  COMMENTS_FETCH_DID_SUCCEED,
  COMMENTS_FETCH_DID_FAIL,
  COMMENTS_FETCH_ADD_COMMENT,
  COMMENTS_FETCH_UPDATE_COMMENT,
  COMMENTS_FETCH_DELETE_COMMENT,
} from "../actions/commentsFetch";
import { AUTH_SIGN_IN_RESET } from "../actions/auth";
import { NOTES_FETCH_DID_START } from "../actions/notesFetch";

const initialState = {};

function commentsFetch(state = initialState, action) {
  let nextState = state;

  switch (action.type) {
    case AUTH_SIGN_IN_RESET:
    case NOTES_FETCH_DID_START:
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
      const { note, comment } = action.payload;
      // Add the comment
      const sortedComments = [...state[note.id].comments, comment];
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
    case COMMENTS_FETCH_UPDATE_COMMENT: {
      const { note, comment } = action.payload;
      // Find the comment
      const commentIndex = state[note.id].comments.findIndex(
        subjectComment => comment.id === subjectComment.id
      );
      if (commentIndex !== -1) {
        // Replace the comment with the new edited comment
        const previousComments = state[note.id].comments;
        const comments = [
          ...previousComments.slice(0, commentIndex),
          comment,
          ...previousComments.slice(commentIndex + 1),
        ];
        nextState = {
          ...state,
          [note.id]: {
            comments,
          },
        };
      } else {
        // console.log(
        //   `commentsFetch COMMENTS_FETCH_UPDATE_COMMENT reducer: Comment wasn't found, this is unexpected`
        // );
      }
      break;
    }
    case COMMENTS_FETCH_DELETE_COMMENT: {
      const { note, comment } = action.payload;
      // Find the comment
      const commentIndex = state[note.id].comments.findIndex(
        subjectComment => comment.id === subjectComment.id
      );
      if (commentIndex !== -1) {
        // Delete the comment
        const previousComments = state[note.id].comments;
        const comments = [
          ...previousComments.slice(0, commentIndex),
          ...previousComments.slice(commentIndex + 1),
        ];
        nextState = {
          ...state,
          [note.id]: {
            comments,
          },
        };
      } else {
        // console.log(
        //   `commentsFetch COMMENTS_FETCH_DELETE_COMMENT reducer: Comment wasn't found, this is unexpected`
        // );
      }
      break;
    }
    default:
      break;
  }

  return nextState;
}

export default commentsFetch;
