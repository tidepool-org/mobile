import Constants from "expo-constants";
import DeviceInfo from "react-native-device-info";

const APP_VERSION_LOAD = "APP_VERSION_LOAD";

const appVersionLoad = () => {
  let version;
  if (Constants.appOwnership === "expo") {
    version = `${Constants.manifest.version} (Expo)`;
  } else {
    version = `${DeviceInfo.getVersionSync()} (${DeviceInfo.getBuildNumberSync()})`;
  }

  return {
    type: APP_VERSION_LOAD,
    payload: version,
  };
};

export { appVersionLoad, APP_VERSION_LOAD };
