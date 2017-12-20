// NOTE: This file is copied via build script to src/reducers/appVersion.js

import { APP_VERSION_SET_VERSION } from "../actions/appVersion";

const initialAppVersionState = "";

// TODO: app version - use react-native-device-info
function appVersion(state = initialAppVersionState, action) {
  switch (action.type) {
    case APP_VERSION_SET_VERSION:
      return action.payload;
    default:
      return state;
  }
}

export default appVersion;
