import {
  NOTES_FETCH_DID_START,
  NOTES_FETCH_DID_SUCCEED,
  NOTES_FETCH_DID_FAIL,
  NOTES_FETCH_ADD_NOTE,
  NOTES_FETCH_UPDATE_NOTE,
  NOTES_FETCH_DELETE_NOTE,
} from "../actions/notesFetch";
import { AUTH_SIGN_IN_RESET } from "../actions/auth";
import HashtagCollection from "../utils/HashtagCollection";

const hashtagCollection = new HashtagCollection();

const initialState = {
  userId: "",
  notes: [],
  hashtags: hashtagCollection.hashtagsSortedByCount,
  errorMessage: "",
  fetching: false,
};

function notesFetch(state = initialState, action) {
  let nextState = state;

  switch (action.type) {
    case AUTH_SIGN_IN_RESET:
      hashtagCollection.resetToDefaultHashtags();
      nextState = {
        ...initialState,
        hashtags: hashtagCollection.hashtagsSortedByCount,
      };
      break;
    case NOTES_FETCH_DID_START: {
      hashtagCollection.resetToDefaultHashtags();
      nextState = {
        userId: action.payload.profile.userId,
        notes: [],
        hashtags: hashtagCollection.hashtagsSortedByCount,
        errorMessage: "",
        fetching: true,
      };
      break;
    }
    case NOTES_FETCH_DID_SUCCEED: {
      const { notes, profile } = action.payload;
      hashtagCollection.reloadHashtagsForObjectsWithText({
        objectsWithText: notes,
        textPropertyName: "messageText",
      });
      nextState = {
        userId: profile.userId,
        notes,
        hashtags: hashtagCollection.hashtagsSortedByCount,
        errorMessage: "",
        fetching: false,
      };
      break;
    }
    case NOTES_FETCH_DID_FAIL: {
      nextState = {
        userId: action.payload.profile.userId,
        notes: [],
        hashtags: hashtagCollection.hashtagsSortedByCount,
        errorMessage: action.payload.errorMessage,
        fetching: false,
      };
      break;
    }
    case NOTES_FETCH_ADD_NOTE: {
      const { profile, note } = action.payload;
      if (profile.userId === state.userId) {
        const sortedNotes = [note, ...state.notes];
        sortedNotes.sort((note1, note2) => note2.timestamp - note1.timestamp);
        hashtagCollection.updateHashtagsForText({
          objectWithTextToAdd: note,
          textPropertyName: "messageText",
        });
        nextState = {
          userId: profile.userId,
          notes: sortedNotes,
          hashtags: hashtagCollection.hashtagsSortedByCount,
          errorMessage: "",
          fetching: false,
        };
      } else {
        // console.log(
        //   `Unexpected insert of note with profile userId: ${
        //     profile.userId
        //   } in notes list for profile userId: ${state.userId}`
        // );
      }
      break;
    }
    case NOTES_FETCH_UPDATE_NOTE: {
      const { profile, note, originalNote } = action.payload;
      if (profile.userId === state.userId) {
        const noteIndex = state.notes.findIndex(
          subjectNote => subjectNote.id === note.id
        );
        if (noteIndex !== -1) {
          const sortedNotes = [
            ...state.notes.slice(0, noteIndex),
            note,
            ...state.notes.slice(noteIndex + 1),
          ];
          sortedNotes.sort((note1, note2) => note2.timestamp - note1.timestamp);
          hashtagCollection.updateHashtagsForText({
            objectWithTextToRemove: originalNote,
            objectWithTextToAdd: note,
            textPropertyName: "messageText",
          });
          nextState = {
            userId: profile.userId,
            notes: sortedNotes,
            hashtags: hashtagCollection.hashtagsSortedByCount,
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
        //     profile.userId
        //   } in notes list for profile userId: ${state.userId}`
        // );
      }
      break;
    }
    case NOTES_FETCH_DELETE_NOTE: {
      const { profile, note } = action.payload;
      if (profile.userId === state.userId) {
        const noteIndex = state.notes.findIndex(
          subjectNote => subjectNote.id === note.id
        );
        if (noteIndex !== -1) {
          const sortedNotes = [
            ...state.notes.slice(0, noteIndex),
            ...state.notes.slice(noteIndex + 1),
          ];
          hashtagCollection.updateHashtagsForText({
            objectWithTextToRemove: note,
            textPropertyName: "messageText",
          });
          nextState = {
            userId: profile.userId,
            notes: sortedNotes,
            hashtags: hashtagCollection.hashtagsSortedByCount,
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
        //     profile.userId
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
