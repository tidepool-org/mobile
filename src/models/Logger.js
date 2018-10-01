import { Alert, Platform } from "react-native";
import DeviceInfo from "react-native-device-info";
import { Client, Configuration } from "rollbar-react-native";

const POST_CLIENT_ITEM_ACCESS_TOKEN = "00788919100a467e8fb08144b427890e";

/* eslint-disable no-console */

class Logger {
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
  constructor() {
    if (__DEV__) {
      this.useRollbar = false;
      this.verbose = true;
    } else {
      this.useRollbar = true;
      this.client = {};
      try {
        const deviceId = DeviceInfo.getDeviceId();
        const model = DeviceInfo.getModel();
        const appName = DeviceInfo.getApplicationName();
        const buildNumber = DeviceInfo.getBuildNumber();
        const bundleId = DeviceInfo.getBundleId();
        const version = DeviceInfo.getVersion();
        const systemVersion = DeviceInfo.getSystemVersion();

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

  updateRollbarWithConfig({ environment, reportLevel }) {
    this.environment = environment || this.environment;
    this.reportLevel = reportLevel || this.reportLevel;

    if (this.useRollbar) {
      try {
        this.rollbar = new Client(
          new Configuration(POST_CLIENT_ITEM_ACCESS_TOKEN, {
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

export default new Logger();
