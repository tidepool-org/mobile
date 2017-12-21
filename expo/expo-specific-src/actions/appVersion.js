// NOTE: This file is copied via build script to src/actions/appVersion.js

export const APP_VERSION_LOAD = "APP_VERSION_LOAD";

export const appVersionLoad = () => ({
  type: APP_VERSION_LOAD,
  payload: "3.0 (Expo)",
});
