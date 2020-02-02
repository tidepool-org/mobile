import { AsyncStorage } from "react-native";

import { HOME_ROUTE_NAME } from "../navigators/routeNames";
import isDrawerOpen from "../navigators/isDrawerOpen";
import isCurrentRoute from "../navigators/isCurrentRoute";
import { TPNativeHealth } from "./TPNativeHealth";
import { Logger } from "./Logger";

const FIRST_TIME_TIPS_SETTINGS_KEY = "FIRST_TIME_TIPS_SETTINGS_KEY";

// TODO: We should handle upgrade from old iOS Tidepool Mobile legacy app and read the existing
// settings, rather than effectively resetting first time tips on upgrade as we do now. Will need
// to use another module to read the settings from UserDefaults.

class FirstTimeTips {
  TIP_CONNECT_TO_HEALTH = "TIP_CONNECT_TO_HEALTH";
  TIP_ADD_NOTE = "TIP_ADD_NOTE";
  TIP_GET_DESKTOP_UPLOADER = "TIP_GET_DESKTOP_UPLOADER";

  constructor() {
    // console.log(`FirstTimeTips ctor`);

    this.areSettingsLoaded = false;
    this.resetTips({ saveSettings: false });
  }

  shouldShowTip(tip, { navigation, notesFetch, currentUser }) {
    let shouldShowTip = false;

    if (
      this.areSettingsLoaded &&
      !this.currentTip &&
      !notesFetch.fetching &&
      tip === this.getNextTip({ currentUser }) &&
      !isDrawerOpen({ navigation }) &&
      isCurrentRoute(HOME_ROUTE_NAME, { navigation })
    ) {
      shouldShowTip = true;
    }

    // console.log(`shouldShowTip: ${tip}, result: ${shouldShowTip}`);

    return shouldShowTip;
  }

  shouldHideTip(tip, { navigation, didUserDismiss }) {
    let shouldHideTip = false;

    if (
      this.areSettingsLoaded &&
      this.currentTip === tip &&
      (didUserDismiss ||
        isDrawerOpen({ navigation }) ||
        !isCurrentRoute(HOME_ROUTE_NAME, { navigation }))
    ) {
      shouldHideTip = true;
    }

    // console.log(`shouldShowTip: ${tip}, result: ${shouldShowTip}`);

    return shouldHideTip;
  }

  showTip({ tip, show, didUserDismiss }) {
    const hide = !show;
    if (show && tip !== this.currentTip) {
      this.currentTip = tip;
      this.settings[tip] = true;
      // Don't save settings until the tip is hidden (when it's acted upon)
      // console.log(`showTip: ${tip} was shown`);
    } else if (hide && tip === this.currentTip) {
      this.currentTip = null;
      if (!didUserDismiss) {
        this.settings[tip] = false;
      }
      this.saveSettings();
      // console.log(`showTip: ${tip} was hidden`);
    }
  }

  getNextTip({ currentUser }) {
    let nextTip = null;

    const {
      shouldShowHealthKitUI,
      isHealthKitInterfaceEnabledForCurrentUser,
      isHealthKitInterfaceConfiguredForOtherUser,
    } = TPNativeHealth.healthKitInterfaceConfiguration;

    if (!nextTip) {
      if (!this.settings[this.TIP_CONNECT_TO_HEALTH] && shouldShowHealthKitUI) {
        nextTip = this.TIP_CONNECT_TO_HEALTH;
      }
    }

    if (!nextTip) {
      if (!this.settings[this.TIP_ADD_NOTE]) {
        nextTip = this.TIP_ADD_NOTE;
      }
    }

    if (!nextTip) {
      if (currentUser.patient) {
        if (
          isHealthKitInterfaceEnabledForCurrentUser ||
          isHealthKitInterfaceConfiguredForOtherUser
        ) {
          // Reset the TIP_GET_DESKTOP_UPLOADER tip since mobile uploader is
          // enabled already for a user. Then, when it's no longer enabled for a
          // user (because user toggled on and then off again), we will show tip
          // again
          if (this.settings[this.TIP_GET_DESKTOP_UPLOADER]) {
            this.settings[this.TIP_GET_DESKTOP_UPLOADER] = false;
            this.saveSettings();
          }
        } else if (!this.settings[this.TIP_GET_DESKTOP_UPLOADER]) {
          nextTip = this.TIP_GET_DESKTOP_UPLOADER;
        }
      }
    }

    // console.log(`getNextTip: result: ${nextTip}`);

    return nextTip;
  }

  resetTips({ saveSettings }) {
    this.currentTip = null;
    this.settings = {
      [this.TIP_CONNECT_TO_HEALTH]: false,
      [this.TIP_ADD_NOTE]: false,
      [this.TIP_GET_DESKTOP_UPLOADER]: false,
    };
    if (saveSettings) {
      this.saveSettings();
    }

    // console.log(`resetTips: saveSettings: ${saveSettings}`);
  }

  async loadSettingsAsync() {
    let settings;
    try {
      settings = JSON.parse(
        await AsyncStorage.getItem(FIRST_TIME_TIPS_SETTINGS_KEY)
      );
    } catch (error) {
      // console.log(`FirstTimeTips.loadSettingsAsync: error: ${error}`);
    }

    if (settings) {
      this.settings = { ...this.settings, ...settings };
      // console.log(
      //   `FirstTimeTips.loadAsync: Successfully loaded settings: ${JSON.stringify(
      //     this.settings,
      //     null,
      //     2
      //   )}`
      // );
    } else {
      // console.log(
      //   `FirstTimeTips.loadAsync: Settings not found, defaulting to: ${JSON.stringify(
      //     this.settings,
      //     null,
      //     2
      //   )}`
      // );
    }

    this.areSettingsLoaded = true;
  }

  saveSettings() {
    AsyncStorage.setItem(
      FIRST_TIME_TIPS_SETTINGS_KEY,
      JSON.stringify(this.settings),
      error => {
        if (!error) {
          // console.log(
          //   `FirstTimeTips.FIRST_TIME_TIPS_SETTINGS_KEY succeeded: ${JSON.stringify(
          //     this.settings,
          //     null,
          //     2
          //   )}`
          // );
        } else {
          Logger.logError(
            `FirstTimeTips.showTip failed: ${JSON.stringify(
              this.settings,
              null,
              2
            )}, error: ${error}`
          );
        }
      }
    );
  }
}

export default new FirstTimeTips();
