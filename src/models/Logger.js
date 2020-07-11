import { Alert, Platform } from "react-native";
import DeviceInfo from "react-native-device-info";
import { Client, Configuration } from "rollbar-react-native";
import Constants from "expo-constants";

/* eslint-disable no-console */

class LoggerSingletonClass {
  LOG_LEVEL_DEBUG = "debug";
  LOG_LEVEL_INFO = "info";
  LOG_LEVEL_WARNING = "warning";
  LOG_LEVEL_ERROR = "error";
  LOG_LEVEL_DEFAULT = this.LOG_LEVEL_WARNING;

  LOG_LEVEL_DEBUG_VALUE = 1;
  LOG_LEVEL_INFO_VALUE = 2;
  LOG_LEVEL_WARNING_VALUE = 3;
  LOG_LEVEL_ERROR_VALUE = 4;

  /* eslint-disable no-undef */
  /* eslint-disable camelcase */
  constructor() {
    if (__DEV__ || Constants.appOwnership === "expo") {
      this.useRollbar = false;
      this.verbose = true;
    } else {
      this.useRollbar = true;
      this.client = {};
      try {
        const deviceId = DeviceInfo.getDeviceIdSync();
        const model = DeviceInfo.getModelSync();
        const appName = DeviceInfo.getApplicationNameSync();
        const buildNumber = DeviceInfo.getBuildNumberSync();
        const bundleId = DeviceInfo.getBundleIdSync();
        const version = DeviceInfo.getVersionSync();
        const systemVersion = DeviceInfo.getSystemVersionSync();

        if (Platform.OS === "ios") {
          this.client = {
            user_ip: "$remote_ip",
            device_code: deviceId,
            phone_model: model,
            app_name: appName,
            code_version: buildNumber,
            bundle_identifier: bundleId,
            short_version: version,
            ios_version: systemVersion,
          };
        } else if (Platform.OS === "android") {
          this.client = {
            user_ip: "$remote_ip",
            name_version: version,
            code_version: buildNumber,
            version_code: buildNumber,
            version_name: version,
            android: {
              phone_model: model,
              version_name: version,
              android_version: systemVersion,
              version_code: buildNumber,
              code_version: version,
            },
          };
        }
        this.updateRollbarWithConfig({});
      } catch (error) {
        Alert.alert("Error", `${error}`, [{ text: "OK" }]);
        this.useRollbar = false;
      }
    }
  }
  /* eslint-enable no-undef */
  /* eslint-enable camelcase */

  updateRollbarWithConfig({ environment, reportLevel }) {
    this.environment = environment || this.environment;
    this.reportLevel = reportLevel || this.reportLevel;

    if (this.useRollbar) {
      try {
        this.rollbar = new Client(
          new Configuration(process.env.ROLLBAR_POST_CLIENT_TOKEN, {
            endpoint: "https://api.rollbar.com/api/1/item/",
            captureIp: true,
            reportLevel: this.reportLevel || this.LOG_LEVEL_DEFAULT,
            payload: {
              environment: this.environment || "unspecified",
              client: this.client,
            },
          })
        );
      } catch (error) {
        this.rollbar = null;
        this.useRollbar = false;
      }
    }
  }

  setUser({ userId, username, fullName }) {
    if (this.rollbar) {
      this.rollbar.setPerson(userId, fullName, username);
    }
  }

  clearUser() {
    if (this.rollbar) {
      this.rollbar.clearPerson();
    }
  }

  logDebug(message, extra) {
    if (this.rollbar) {
      this.rollbar.debug(message, extra);
    }

    if (this.verbose) {
      if (message && extra) {
        console.log(`debug: ${message}, extra: ${extra}`);
      } else if (message) {
        console.log(`debug: ${message}`);
      }
    }
  }

  logInfo(message, extra) {
    if (this.rollbar) {
      this.rollbar.info(message, extra);
    }

    if (this.verbose) {
      if (message && extra) {
        console.log(`info: ${message}, extra: ${extra}`);
      } else if (message) {
        console.log(`info: ${message}`);
      }
    }
  }

  logWarning(message, extra) {
    if (this.rollbar) {
      this.rollbar.warning(message, extra);
    }

    if (this.verbose) {
      if (message && extra) {
        console.log(`warning: ${message}, extra: ${extra}`);
      } else if (message) {
        console.log(`warning: ${message}`);
      }
    }
  }

  logError(message, extra) {
    if (this.rollbar) {
      this.rollbar.error(message, extra);
    }

    if (this.verbose) {
      if (message && extra) {
        console.log(`error: ${message}, extra: ${extra}`);
      } else if (message) {
        console.log(`error: ${message}`);
      }
    }
  }
}

const Logger = new LoggerSingletonClass();

export { Logger };
