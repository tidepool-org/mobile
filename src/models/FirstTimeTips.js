import { AsyncStorage, Platform } from "react-native";

import { HOME_ROUTE_NAME } from "../navigators/routeNames";
import isDrawerOpen from "../navigators/isDrawerOpen";
import isCurrentRoute from "../navigators/isCurrentRoute";
import Logger from "./Logger";

const FIRST_TIME_TIPS_SETTINGS_KEY = "FIRST_TIME_TIPS_SETTINGS_KEY";

// TODO: We should handle upgrade from old iOS Tidepool Mobile legacy app and read the existing
// settings, rather than effectively resetting first time tips on upgrade as we do now. Will need
// to use another module to read the settings from UserDefaults.

class FirstTimeTips {
  TIP_CONNECT_TO_HEALTH = "connectToHealth";
  TIP_ADD_NOTE = "addNote";
  TIP_GET_DESKTOP_UPLOADER = "getDesktopUploader";

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
      tip === this.getNextTip({ notesFetch, currentUser }) &&
      !isDrawerOpen({ navigation }) &&
      isCurrentRoute(HOME_ROUTE_NAME, { navigation })
    ) {
      shouldShowTip = true;
    }

    // console.log(`shouldShowTip: ${tip}, result: ${shouldShowTip}`);

    return shouldShowTip;
  }

  showTip(tip, show) {
    const hide = !show;
    if (show && tip !== this.currentTip) {
      this.currentTip = tip;
      this.settings[tip] = true;
      // Don't save settings until the tip is hidden (when it's acted upon)
      // console.log(`showTip: ${tip} was shown`);
    } else if (hide && tip === this.currentTip) {
      this.currentTip = null;
      this.saveSettings();
      // console.log(`showTip: ${tip} was hidden`);
    }
  }

  getNextTip({ /* notesFetch, */ currentUser }) {
    let nextTip = null;

    if (
      Platform.OS === "ios" &&
      currentUser.patient &&
      !this.settings[this.TIP_CONNECT_TO_HEALTH]
    ) {
      nextTip = this.TIP_CONNECT_TO_HEALTH;
    } else if (
      // NOTE: We also check that we haven't shown TIP_GET_DESKTOP_UPLOADER here
      // since we only want to show the TIP_ADD_NOTE for fresh installs where
      // tooltips haven't been shown yet. The sequence should be:
      // 1. TIP_CONNECT_TO_HEALTH
      // 2. TIP_ADD_NOTE
      // 3. TIP_GET_DESKTOP_UPLOADER
      !this.settings[this.TIP_ADD_NOTE] &&
      !this.settings[this.TIP_GET_DESKTOP_UPLOADER]
    ) {
      nextTip = this.TIP_ADD_NOTE;
    } else if (!this.settings[this.TIP_GET_DESKTOP_UPLOADER]) {
      nextTip = this.TIP_GET_DESKTOP_UPLOADER;
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
