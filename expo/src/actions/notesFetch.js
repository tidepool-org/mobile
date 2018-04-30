import api from "../api";
import { currentProfileSaveAsync } from "../actions/currentProfile";

const NOTES_FETCH_SET_SEARCH_FILTER = "NOTES_FETCH_SET_SEARCH_FILTER";
const NOTES_FETCH_DID_START = "NOTES_FETCH_DID_START";
const NOTES_FETCH_DID_SUCCEED = "NOTES_FETCH_DID_SUCCEED";
const NOTES_FETCH_DID_FAIL = "NOTES_FETCH_DID_FAIL";
const NOTES_FETCH_ADD_NOTE = "NOTES_FETCH_ADD_NOTE";
const NOTES_FETCH_UPDATE_NOTE = "NOTES_FETCH_UPDATE_NOTE";
const NOTES_FETCH_DELETE_NOTE = "NOTES_FETCH_DELETE_NOTE";

// TODO: fetch - cancel outstanding request if we get another request to start fetching while one is in progress.
// TODO: fetch - cancel outstanding request if we sign out while fetch is in progress

const notesFetchSetSearchFilter = ({ searchText }) => ({
  type: NOTES_FETCH_SET_SEARCH_FILTER,
  payload: { searchText },
});

const notesFetchDidStart = ({ profile }) => ({
  type: NOTES_FETCH_DID_START,
  payload: { profile },
});

const notesFetchDidSucceed = ({ profile, notes }) => ({
  type: NOTES_FETCH_DID_SUCCEED,
  payload: { profile, notes },
});

const notesFetchDidFail = ({ profile, errorMessage }) => ({
  type: NOTES_FETCH_DID_FAIL,
  payload: { profile, errorMessage },
});

const notesFetchAsync = ({ profile }) => async dispatch => {
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

const notesFetchAddNote = ({ note, profile }) => ({
  type: NOTES_FETCH_ADD_NOTE,
  payload: { note, profile },
});

const notesFetchUpdateNote = ({ note, originalNote, profile }) => ({
  type: NOTES_FETCH_UPDATE_NOTE,
  payload: { note, originalNote, profile },
});

const notesFetchDeleteNote = ({ note, profile }) => ({
  type: NOTES_FETCH_DELETE_NOTE,
  payload: { note, profile },
});

const notesSwitchProfileAndFetchAsync = ({
  authUser,
  profile,
}) => async dispatch => {
  dispatch(currentProfileSaveAsync({ authUser, profile }));
  dispatch(notesFetchAsync({ profile }));
};

export {
  notesFetchSetSearchFilter,
  notesFetchAsync,
  notesFetchAddNote,
  notesFetchUpdateNote,
  notesFetchDeleteNote,
  notesSwitchProfileAndFetchAsync,
  NOTES_FETCH_SET_SEARCH_FILTER,
  NOTES_FETCH_DID_START,
  NOTES_FETCH_DID_SUCCEED,
  NOTES_FETCH_DID_FAIL,
  NOTES_FETCH_ADD_NOTE,
  NOTES_FETCH_UPDATE_NOTE,
  NOTES_FETCH_DELETE_NOTE,
};
