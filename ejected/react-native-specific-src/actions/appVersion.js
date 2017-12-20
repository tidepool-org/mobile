// NOTE: This file is copied via build script to src/actions/appVersion.js

import VersionNumber from "react-native-version-number";

export const APP_VERSION_SET_VERSION = "APP_VERSION_SET_VERSION";

// TODO: app version - use react-native-device-info
export const appVersionSetVersion = () => {
  const version = `${VersionNumber.appVersion}`;

  return {
    type: APP_VERSION_SET_VERSION,
    payload: version,
  };
};
