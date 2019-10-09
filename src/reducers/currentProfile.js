import {
  CURRENT_PROFILE_SET,
  CURRENT_PROFILE_SETTINGS_FETCH_DID_SUCCEED,
} from "../actions/currentProfile";

import { AUTH_SIGN_IN_RESET } from "../actions/auth";
import {
  DEFAULT_LOW_BG_BOUNDARY_VALUE,
  DEFAULT_HIGH_BG_BOUNDARY_VALUE,
} from "../components/Graph/helpers";
import { Logger } from "../models/Logger";

const defaultProfileSettings = {
  lowBGBoundary: DEFAULT_LOW_BG_BOUNDARY_VALUE,
  highBGBoundary: DEFAULT_HIGH_BG_BOUNDARY_VALUE,
};
const initialState = {
  userId: "",
  fullName: "",
  ...defaultProfileSettings,
};
const profileSettingsMap = new Map();

function currentProfile(state = initialState, action) {
  let nextState = state;

  switch (action.type) {
    case AUTH_SIGN_IN_RESET:
      nextState = initialState;
      break;
    case CURRENT_PROFILE_SET:
      {
        const {
          profile,
          profile: { userId },
        } = action.payload;
        const settings =
          profileSettingsMap.get(userId) || defaultProfileSettings;
        nextState = { ...profile, ...settings };
      }
      break;
    case CURRENT_PROFILE_SETTINGS_FETCH_DID_SUCCEED:
      {
        const {
          profile,
          profile: { userId },
          settings,
        } = action.payload;
        profileSettingsMap.set(userId, settings);
        if (state.userId === userId) {
          nextState = { ...profile, ...settings };
        } else {
          Logger.logWarning(
            `Unexpected settings fetch for userId: ${userId} with different current profile userId: ${
              state.userId
            }. Perhaps a previous settings fetch completed after switching to another profile? Just ignore this, will use the last loaded settings for the current profile`
          );
        }
      }
      break;
    default:
      break;
  }

  return nextState;
}

export default currentProfile;
