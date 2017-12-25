import api from "../api";

export const NOTES_FETCH_DID_START = "NOTES_FETCH_DID_START";
export const NOTES_FETCH_DID_SUCCEED = "NOTES_FETCH_DID_SUCCEED";
export const NOTES_FETCH_DID_FAIL = "NOTES_FETCH_DID_FAIL";

// TODO: fetch - cancel outstanding request if we get another request to start fetching while one is in progress.
// TODO: fetch - cancel outstanding request if we sign out while fetch is in progress

export const notesFetchDidStart = ({ userId }) => ({
  type: NOTES_FETCH_DID_START,
  payload: { userId },
});

export const notesFetchDidSucceed = ({ userId, notes }) => ({
  type: NOTES_FETCH_DID_SUCCEED,
  payload: { userId, notes },
});

export const notesFetchDidFail = ({ userId, errorMessage }) => ({
  type: NOTES_FETCH_DID_FAIL,
  payload: { userId, errorMessage },
});

export const notesFetchAsync = ({ userId }) => async dispatch => {
  dispatch(notesFetchDidStart(NOTES_FETCH_DID_START));

  const { notes, errorMessage } = await api().fetchNotesAsync({ userId });

  if (errorMessage) {
    dispatch(notesFetchDidFail({ userId, errorMessage }));
  } else {
    dispatch(notesFetchDidSucceed({ userId, notes }));
  }
};
