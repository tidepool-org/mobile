import {
  NOTES_FETCH_SET_SEARCH_FILTER,
  NOTES_FETCH_DID_START,
  NOTES_FETCH_DID_SUCCEED,
  NOTES_FETCH_DID_FAIL,
  NOTES_FETCH_ADD_NOTE,
  NOTES_FETCH_UPDATE_NOTE,
  NOTES_FETCH_DELETE_NOTE,
  NOTES_FETCH_ADVANCE_TOGGLE_EXPANDED_NOTES_COUNT,
} from "../actions/notesFetch";
import { AUTH_SIGN_IN_RESET } from "../actions/auth";
import NotesFetchData from "../models/NotesFetchData";

const initialNotesFetchData = new NotesFetchData();

function notesFetch(
  state = { ...initialNotesFetchData, notesFetchData: initialNotesFetchData },
  action
) {
  let nextState = state;

  switch (action.type) {
    case AUTH_SIGN_IN_RESET: {
      const notesFetchData = new NotesFetchData();
      nextState = { ...notesFetchData, notesFetchData };
      break;
    }
    case NOTES_FETCH_SET_SEARCH_FILTER: {
      const { searchText } = action.payload;
      const { notesFetchData } = state;
      notesFetchData.setSearchFilter({ searchText });
      nextState = { ...notesFetchData, notesFetchData };
      break;
    }
    case NOTES_FETCH_DID_START: {
      const {
        profile: { userId },
      } = action.payload;
      const { notesFetchData } = state;
      notesFetchData.didStart({ userId });
      nextState = { ...notesFetchData, notesFetchData };
      break;
    }
    case NOTES_FETCH_DID_SUCCEED: {
      const { notes, profile } = action.payload;
      const { notesFetchData } = state;
      notesFetchData.didSucceed({ notes, profile });
      nextState = { ...notesFetchData, notesFetchData };
      break;
    }
    case NOTES_FETCH_DID_FAIL: {
      const { errorMessage, profile } = action.payload;
      const { notesFetchData } = state;
      notesFetchData.didFail({ errorMessage, profile });
      nextState = { ...notesFetchData, notesFetchData };
      break;
    }
    case NOTES_FETCH_ADD_NOTE: {
      const { profile, note } = action.payload;
      const { notesFetchData } = state;
      notesFetchData.addNote({ profile, note });
      nextState = { ...notesFetchData, notesFetchData };
      break;
    }
    case NOTES_FETCH_UPDATE_NOTE: {
      const { profile, note, originalNote } = action.payload;
      const { notesFetchData } = state;
      notesFetchData.updateNote({ profile, note, originalNote });
      nextState = { ...notesFetchData, notesFetchData };
      break;
    }
    case NOTES_FETCH_DELETE_NOTE: {
      const { profile, note } = action.payload;
      const { notesFetchData } = state;
      notesFetchData.deleteNote({ profile, note });
      nextState = { ...notesFetchData, notesFetchData };
      break;
    }
    case NOTES_FETCH_ADVANCE_TOGGLE_EXPANDED_NOTES_COUNT: {
      const { notesFetchData } = state;
      notesFetchData.advanceToggleExpandedNotesCount();
      nextState = { ...notesFetchData, notesFetchData };
      break;
    }
    default:
      break;
  }

  return nextState;
}

export default notesFetch;
