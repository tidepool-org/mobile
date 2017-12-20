// NOTE: This file is copied via build script to src/actions/appVersion.js

export const APP_VERSION_SET_VERSION = "APP_VERSION_SET_VERSION";

export const appVersionSetVersion = () => ({
  type: APP_VERSION_SET_VERSION,
  payload: "3.0 (Expo)"
});
