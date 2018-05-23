import { AsyncStorage } from "react-native";

import api from "../api";

const CURRENT_PROFILE_SET = "CURRENT_PROFILE_SET";
const CURRENT_PROFILE_SETTINGS_FETCH_DID_SUCCEED =
  "CURRENT_PROFILE_SETTINGS_FETCH_DID_SUCCEED";
const CURRENT_PROFILE_KEY = "CURRENT_PROFILE_KEY";
const getCurrentProfileKey = ({ authUser }) =>
  `${authUser.userId}-${CURRENT_PROFILE_KEY}`;

const currentProfileSet = ({ profile }) => ({
  type: CURRENT_PROFILE_SET,
  payload: { profile },
});

const currentProfileSettingsFetchDidSucceed = ({ profile, settings }) => ({
  type: CURRENT_PROFILE_SETTINGS_FETCH_DID_SUCCEED,
  payload: { profile, settings },
});

const currentProfileSettingsFetchAsync = ({ profile }) => async dispatch => {
  const { userId } = profile;
  const { settings } = await api().fetchProfileSettingsAsync({
    userId,
  });

  if (settings) {
    dispatch(currentProfileSettingsFetchDidSucceed({ profile, settings }));
  } else {
    // console.log(
    //   `currentProfileSettingsFetchAsync: No settings were found, using last loaded settings, or defaults`
    // );
  }
};

const currentProfileRestoreAsync = ({ authUser }) => async dispatch => {
  let profile = authUser;
  try {
    profile = JSON.parse(
      await AsyncStorage.getItem(getCurrentProfileKey({ authUser }))
    );
    if (!profile) {
      // console.log(
      //   `currentProfileRestoreAsync: No profile was saved, defaulting to current authenticated user's profile`
      // );
      profile = authUser;
    }
  } catch (error) {
    // console.log(`currentProfileRestoreAsync: error: ${error}`);
  }

  dispatch(currentProfileSet({ profile }));
  dispatch(currentProfileSettingsFetchAsync({ profile }));
};

const currentProfileSaveAsync = ({ authUser, profile }) => async dispatch => {
  try {
    AsyncStorage.setItem(
      getCurrentProfileKey({ authUser }),
      JSON.stringify(profile)
    );
  } catch (error) {
    // console.log(`currentProfileSaveAsync: error: ${error}`);
  }

  dispatch(currentProfileSet({ profile }));
  dispatch(currentProfileSettingsFetchAsync({ profile }));
};

export {
  currentProfileRestoreAsync,
  currentProfileSaveAsync,
  CURRENT_PROFILE_SET,
  CURRENT_PROFILE_SETTINGS_FETCH_DID_SUCCEED,
};
