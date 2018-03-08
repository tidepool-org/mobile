import api from "../api";

import { notesFetchUpdateNote } from "../actions/notesFetch";

export const NOTE_UPDATE_DID_START = "NOTE_UPDATE_DID_START";
export const NOTE_UPDATE_DID_SUCCEED = "NOTE_UPDATE_DID_SUCCEED";
export const NOTE_UPDATE_DID_FAIL = "NOTE_UPDATE_DID_FAIL";

export const noteUpdateDidStart = ({ note }) => ({
  type: NOTE_UPDATE_DID_START,
  payload: { note },
});

// TODO: animation - need to do some sort of distinct update animation
export const noteUpdateDidSucceed = ({ note }) => ({
  type: NOTE_UPDATE_DID_SUCCEED,
  payload: { note },
});

export const noteUpdateDidFail = ({ note, errorMessage }) => ({
  type: NOTE_UPDATE_DID_FAIL,
  payload: { note, errorMessage },
});

export const noteUpdateAsync = ({ note, originalNote, currentProfile }) => async dispatch => {
  dispatch(noteUpdateDidStart({ note }));

  const { errorMessage } = await api().updateNoteAsync({ note });

  if (errorMessage) {
    dispatch(noteUpdateDidFail({ note, errorMessage }));
  } else {
    dispatch(noteUpdateDidSucceed({ note }));
    dispatch(notesFetchUpdateNote({ note, originalNote, profile: currentProfile }));
  }
};
