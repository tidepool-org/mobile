import {
  GRAPH_DATA_FETCH_DID_START,
  GRAPH_DATA_FETCH_DID_SUCCEED,
  GRAPH_DATA_FETCH_DID_FAIL,
} from "../actions/graphDataFetch";
import { AUTH_SIGN_IN_RESET } from "../actions/auth";
import { NOTES_FETCH_DID_START } from "../actions/notesFetch";

const initialState = {};

function graphDataFetch(state = initialState, action) {
  let nextState = state;

  switch (action.type) {
    case AUTH_SIGN_IN_RESET:
    case NOTES_FETCH_DID_START: // Also reset to initial state if a refresh of notes list starts
      nextState = initialState;
      break;
    case GRAPH_DATA_FETCH_DID_START: {
      const { messageId } = action.payload;
      nextState = {
        ...state,
        [messageId]: {
          graphData: {},
          errorMessage: "",
          fetching: true,
        },
      };
      break;
    }
    case GRAPH_DATA_FETCH_DID_SUCCEED: {
      const { messageId, graphData } = action.payload;
      nextState = {
        ...state,
        [messageId]: {
          graphData,
          errorMessage: "",
          fetching: false,
          fetched: true,
        },
      };
      break;
    }
    case GRAPH_DATA_FETCH_DID_FAIL: {
      const { messageId, errorMessage } = action.payload;
      nextState = {
        ...state,
        [messageId]: {
          graphData: {},
          errorMessage,
          fetching: false,
          fetched: false,
        },
      };
      break;
    }
    default:
      break;
  }

  return nextState;
}

export default graphDataFetch;
