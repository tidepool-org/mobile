import api from "../api";

export const PROFILES_FETCH_DID_START = "PROFILES_FETCH_DID_START";
export const PROFILES_FETCH_DID_SUCCEED = "PROFILES_FETCH_DID_SUCCEED";
export const PROFILES_FETCH_DID_FAIL = "PROFILES_FETCH_DID_FAIL";

// TODO: fetch - cancel outstanding request if we get another request to start fetching while one is in progress.
// TODO: fetch - cancel outstanding request if we sign out while fetch is in progress

export const profilesFetchDidStart = ({ userId }) => ({
  type: PROFILES_FETCH_DID_START,
  payload: { userId },
});

export const profilesFetchDidSucceed = ({ userId, profiles }) => ({
  type: PROFILES_FETCH_DID_SUCCEED,
  payload: { userId, profiles },
});

export const profilesFetchDidFail = ({ userId, errorMessage }) => ({
  type: PROFILES_FETCH_DID_FAIL,
  payload: { userId, errorMessage },
});

export const profilesFetchAsync = ({ userId, fullName }) => async dispatch => {
  dispatch(profilesFetchDidStart(PROFILES_FETCH_DID_START));

  const { profiles, errorMessage } = await api().fetchViewableUserProfilesAsync(
    { userId, fullName }
  );

  if (errorMessage) {
    dispatch(profilesFetchDidFail({ userId, errorMessage }));
  } else {
    dispatch(profilesFetchDidSucceed({ userId, profiles }));
  }
};
