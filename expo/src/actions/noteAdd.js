import api from "../api";

import { notesFetchAddNote } from "../actions/notesFetch";

export const NOTE_ADD_DID_START = "NOTE_ADD_DID_START";
export const NOTE_ADD_DID_SUCCEED = "NOTE_ADD_DID_SUCCEED";
export const NOTE_ADD_DID_FAIL = "NOTE_ADD_DID_FAIL";

export const noteAddDidStart = ({
  currentProfile,
  messageText,
  timestamp,
}) => ({
  type: NOTE_ADD_DID_START,
  payload: { currentProfile, messageText, timestamp },
});

// TODO: animation - need to do some sort of distinct update animation
export const noteAddDidSucceed = ({ note }) => ({
  type: NOTE_ADD_DID_SUCCEED,
  payload: { note },
});

// TODO: Need reducer for this to display error alert and test it with failure .. consider moving errorMessage handling higher up the component hierarchy, especially if we're always just rendering it as an alert
export const noteAddDidFail = ({ errorMessage }) => ({
  type: NOTE_ADD_DID_FAIL,
  payload: { errorMessage },
});

export const noteAddAsync = ({
  currentUser,
  currentProfile,
  messageText,
  timestamp,
}) => async dispatch => {
  dispatch(
    noteAddDidStart({ currentUser, currentProfile, messageText, timestamp })
  );

  const { errorMessage, note } = await api().addNoteAsync({
    currentUser,
    currentProfile,
    messageText,
    timestamp,
  });

  if (errorMessage) {
    dispatch(noteAddDidFail({ errorMessage }));
  } else {
    dispatch(noteAddDidSucceed({ note }));
    dispatch(notesFetchAddNote({ note, profile: currentProfile }));
  }
};
