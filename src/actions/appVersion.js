import DeviceInfo from "react-native-device-info";

const APP_VERSION_LOAD = "APP_VERSION_LOAD";

const appVersionLoad = () => {
  let version = "3.0.4 (Expo)";
  try {
    version = `${DeviceInfo.getVersion()} (${DeviceInfo.getBuildNumber()})`;
  } catch (error) {
    // console.log(
    //   `Failed to get DeviceInfo version, defaulting to ${version}, error: ${error}`
    // );
  }

  return {
    type: APP_VERSION_LOAD,
    payload: version,
  };
};

export { appVersionLoad, APP_VERSION_LOAD };
