import api from "../api";

import { notesFetchUpdateNote } from "./notesFetch";

const NOTE_UPDATE_DID_START = "NOTE_UPDATE_DID_START";
const NOTE_UPDATE_DID_SUCCEED = "NOTE_UPDATE_DID_SUCCEED";
const NOTE_UPDATE_DID_FAIL = "NOTE_UPDATE_DID_FAIL";

const noteUpdateDidStart = ({ note }) => ({
  type: NOTE_UPDATE_DID_START,
  payload: { note },
});

// TODO: animation - need to do some sort of distinct update animation
const noteUpdateDidSucceed = ({ note }) => ({
  type: NOTE_UPDATE_DID_SUCCEED,
  payload: { note },
});

const noteUpdateDidFail = ({ note, errorMessage }) => ({
  type: NOTE_UPDATE_DID_FAIL,
  payload: { note, errorMessage },
});

const noteUpdateAsync = ({
  note,
  originalNote,
  currentProfile,
}) => async dispatch => {
  dispatch(noteUpdateDidStart({ note }));

  const { errorMessage } = await api().updateNoteAsync({ note });

  if (errorMessage) {
    dispatch(noteUpdateDidFail({ note, errorMessage }));
  } else {
    dispatch(noteUpdateDidSucceed({ note }));
    dispatch(
      notesFetchUpdateNote({ note, originalNote, profile: currentProfile })
    );
  }
};

export {
  noteUpdateDidStart,
  noteUpdateDidSucceed,
  noteUpdateDidFail,
  noteUpdateAsync,
  NOTE_UPDATE_DID_START,
  NOTE_UPDATE_DID_SUCCEED,
  NOTE_UPDATE_DID_FAIL,
};
