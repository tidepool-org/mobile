// NOTE: This file is copied via build script to src/actions/appVersion.js

const APP_VERSION_LOAD = "APP_VERSION_LOAD";

const appVersionLoad = () => ({
  type: APP_VERSION_LOAD,
  payload: "3.0 (Expo)",
});

export { appVersionLoad, APP_VERSION_LOAD };
