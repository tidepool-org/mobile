import { api } from "../api";

const PROFILES_FETCH_DID_START = "PROFILES_FETCH_DID_START";
const PROFILES_FETCH_DID_SUCCEED = "PROFILES_FETCH_DID_SUCCEED";
const PROFILES_FETCH_DID_FAIL = "PROFILES_FETCH_DID_FAIL";

// TODO: fetch - cancel outstanding request if we get another request to start fetching while one is in progress.
// TODO: fetch - cancel outstanding request if we sign out while fetch is in progress

const profilesFetchDidStart = ({ userId }) => ({
  type: PROFILES_FETCH_DID_START,
  payload: { userId },
});

const profilesFetchDidSucceed = ({ userId, profiles }) => ({
  type: PROFILES_FETCH_DID_SUCCEED,
  payload: { userId, profiles },
});

const profilesFetchDidFail = ({ userId, errorMessage }) => ({
  type: PROFILES_FETCH_DID_FAIL,
  payload: { userId, errorMessage },
});

const profilesFetchAsync = ({ userId, fullName }) => async dispatch => {
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

export {
  profilesFetchDidStart,
  profilesFetchDidSucceed,
  profilesFetchDidFail,
  profilesFetchAsync,
  PROFILES_FETCH_DID_START,
  PROFILES_FETCH_DID_SUCCEED,
  PROFILES_FETCH_DID_FAIL,
};
