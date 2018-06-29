import api from "../api";
import { notesFetchDeleteNote } from "./notesFetch";

const NOTE_DELETE_DID_START = "NOTE_DELETE_DID_START";
const NOTE_DELETE_DID_SUCCEED = "NOTE_DELETE_DID_SUCCEED";
const NOTE_DELETE_DID_FAIL = "NOTE_DELETE_DID_FAIL";

const noteDeleteDidStart = ({ note }) => ({
  type: NOTE_DELETE_DID_START,
  payload: { note },
});

const noteDeleteDidSucceed = ({ note }) => ({
  type: NOTE_DELETE_DID_SUCCEED,
  payload: { note },
});

// TODO: Need reducer for this to display error alert and test it with failure .. consider moving errorMessage handling higher up the component hierarchy, especially if we're always just rendering it as an alert
const noteDeleteDidFail = ({ errorMessage }) => ({
  type: NOTE_DELETE_DID_FAIL,
  payload: { errorMessage },
});

const noteDeleteAsync = ({ note, currentProfile }) => async dispatch => {
  dispatch(noteDeleteDidStart({ note }));

  const { errorMessage } = await api().deleteNoteAsync({
    note,
  });

  if (errorMessage) {
    dispatch(noteDeleteDidFail({ errorMessage }));
  } else {
    dispatch(noteDeleteDidSucceed({ note }));
    dispatch(notesFetchDeleteNote({ note, profile: currentProfile }));
  }
};

export {
  noteDeleteDidStart,
  noteDeleteDidSucceed,
  noteDeleteDidFail,
  noteDeleteAsync,
  NOTE_DELETE_DID_START,
  NOTE_DELETE_DID_SUCCEED,
  NOTE_DELETE_DID_FAIL,
};
