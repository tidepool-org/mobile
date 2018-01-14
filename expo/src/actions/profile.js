import { AsyncStorage } from "react-native";

const PROFILE_KEY = "PROFILE_KEY";

export const PROFILE_SET = "PROFILE_SET";

const getProfileKey = ({ authUser }) => `${authUser.userId}-${PROFILE_KEY}`;

export const profileSet = ({ profile }) => ({
  type: PROFILE_SET,
  payload: profile,
});

export const profileRestoreAndSetAsync = ({ authUser }) => async dispatch => {
  let profile = authUser;
  try {
    profile = JSON.parse(
      await AsyncStorage.getItem(getProfileKey({ authUser }))
    );
    if (!profile) {
      // console.log(
      //   `profileRestoreAndSetAsync: No profile was saved, defaulting to current authenticated user's profile`
      // );
      profile = authUser;
    }
  } catch (error) {
    // console.log(`profileRestoreAndSetAsync: error: ${error}`);
  }

  dispatch(profileSet({ profile }));
};

export const profileSaveAndSetAsync = ({
  authUser,
  profile,
}) => async dispatch => {
  try {
    AsyncStorage.setItem(getProfileKey({ authUser }), JSON.stringify(profile));
  } catch (error) {
    // console.log(`profileSaveAndSetAsync: error: ${error}`);
  }

  dispatch(profileSet({ profile }));
};
