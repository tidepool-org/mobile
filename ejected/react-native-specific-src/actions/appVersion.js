// NOTE: This file is copied via build script to src/actions/appVersion.js

import VersionNumber from "react-native-version-number";

export const APP_VERSION_LOAD = "APP_VERSION_LOAD";

// TODO: app version - use react-native-device-info
export const appVersionLoad = () => {
  const version = `${VersionNumber.appVersion}`;

  return {
    type: APP_VERSION_LOAD,
    payload: version,
  };
};
