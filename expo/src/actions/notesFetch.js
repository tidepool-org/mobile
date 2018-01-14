import api from "../api";
import { profileSaveAndSetAsync } from "../actions/profile";

export const NOTES_FETCH_DID_START = "NOTES_FETCH_DID_START";
export const NOTES_FETCH_DID_SUCCEED = "NOTES_FETCH_DID_SUCCEED";
export const NOTES_FETCH_DID_FAIL = "NOTES_FETCH_DID_FAIL";
export const NOTES_FETCH_ADD_NOTE = "NOTES_FETCH_ADD_NOTE";
export const NOTES_FETCH_UPDATE_NOTE = "NOTES_FETCH_UPDATE_NOTE";

// TODO: fetch - cancel outstanding request if we get another request to start fetching while one is in progress.
// TODO: fetch - cancel outstanding request if we sign out while fetch is in progress

export const notesFetchDidStart = ({ profile }) => ({
  type: NOTES_FETCH_DID_START,
  payload: { profile },
});

export const notesFetchDidSucceed = ({ profile, notes }) => ({
  type: NOTES_FETCH_DID_SUCCEED,
  payload: { profile, notes },
});
export const notesFetchDidFail = ({ profile, errorMessage }) => ({
  type: NOTES_FETCH_DID_FAIL,
  payload: { profile, errorMessage },
});

export const notesFetchAsync = ({ profile }) => async dispatch => {
  dispatch(notesFetchDidStart({ profile }));

  const { notes, errorMessage } = await api().fetchNotesAsync({
    userId: profile.userId,
  });

  if (errorMessage) {
    dispatch(notesFetchDidFail({ profile, errorMessage }));
  } else {
    dispatch(notesFetchDidSucceed({ profile, notes }));
  }
};

export const notesFetchAddNote = ({ note, profile }) => ({
  type: NOTES_FETCH_ADD_NOTE,
  payload: { note, profile },
});

export const notesFetchUpdateNote = ({ note, profile }) => ({
  type: NOTES_FETCH_UPDATE_NOTE,
  payload: { note, profile },
});

export const notesSwitchProfileAndFetchAsync = ({
  authUser,
  profile,
}) => async dispatch => {
  dispatch(profileSaveAndSetAsync({ authUser, profile }));
  dispatch(notesFetchAsync({ profile }));
};
