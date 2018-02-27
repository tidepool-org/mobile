import {
  NOTES_FETCH_DID_START,
  NOTES_FETCH_DID_SUCCEED,
  NOTES_FETCH_DID_FAIL,
  NOTES_FETCH_ADD_NOTE,
  NOTES_FETCH_UPDATE_NOTE,
  NOTES_FETCH_DELETE_NOTE,
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
      nextState = { ...initialState };
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
    case NOTES_FETCH_ADD_NOTE: {
      if (action.payload.profile.userId === state.userId) {
        const sortedNotes = [action.payload.note, ...state.notes];
        sortedNotes.sort((note1, note2) => note2.timestamp - note1.timestamp);
        nextState = {
          userId: action.payload.profile.userId,
          notes: sortedNotes,
          errorMessage: "",
          fetching: false,
        };
      } else {
        // console.log(
        //   `Unexpected insert of note with profile userId: ${
        //     action.payload.profile.userId
        //   } in notes list for profile userId: ${state.userId}`
        // );
      }
      break;
    }
    case NOTES_FETCH_UPDATE_NOTE: {
      if (action.payload.profile.userId === state.userId) {
        const noteIndex = state.notes.findIndex(
          note => note.id === action.payload.note.id
        );
        if (noteIndex !== -1) {
          const sortedNotes = [
            ...state.notes.slice(0, noteIndex),
            action.payload.note,
            ...state.notes.slice(noteIndex + 1),
          ];
          sortedNotes.sort((note1, note2) => note2.timestamp - note1.timestamp);
          nextState = {
            userId: action.payload.profile.userId,
            notes: sortedNotes,
            errorMessage: "",
            fetching: false,
          };
        } else {
          // console.log(
          //   `Could not find the edited note in current notes, this is unexpected`
          // );
        }
      } else {
        // console.log(
        //   `Unexpected update of note with profile userId: ${
        //     action.payload.profile.userId
        //   } in notes list for profile userId: ${state.userId}`
        // );
      }
      break;
    }
    case NOTES_FETCH_DELETE_NOTE: {
      if (action.payload.profile.userId === state.userId) {
        const noteIndex = state.notes.findIndex(
          note => note.id === action.payload.note.id
        );
        if (noteIndex !== -1) {
          const sortedNotes = [
            ...state.notes.slice(0, noteIndex),
            ...state.notes.slice(noteIndex + 1),
          ];
          nextState = {
            userId: action.payload.profile.userId,
            notes: sortedNotes,
            errorMessage: "",
            fetching: false,
          };
        } else {
          // console.log(
          //   `Could not find the deleted note in current notes, this is unexpected`
          // );
        }
      } else {
        // console.log(
        //   `Unexpected delete of note with profile userId: ${
        //     action.payload.profile.userId
        //   } in notes list for profile userId: ${state.userId}`
        // );
      }
      break;
    }
    default:
      break;
  }

  return nextState;
}

export default notesFetch;
