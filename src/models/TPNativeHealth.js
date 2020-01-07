import { NativeModules, NativeEventEmitter } from "react-native";

class TPNativeHealthSingletonClass {
  constructor() {
    this.shouldShowHealthKitUI = false;

    this.healthKitInterfaceEnabledForCurrentUser = false;
    this.healthKitInterfaceConfiguredForOtherUser = false;
    this.currentHealthKitUsername = "";
    this.hasPresentedSyncUI = false;

    this.isUploadingHistorical = false;
    this.historicalUploadCurrentDay = 0;
    this.historicalUploadTotalDays = 0;
    this.lastCurrentUploadUiDescription = "";
    this.turnOffUploaderReason = "";
    this.turnOffUploaderError = "";

    this.listeners = [];

    try {
      this.nativeModule = NativeModules.TPNativeHealth;

      this.shouldShowHealthKitUI = this.nativeModule.shouldShowHealthKitUI();
      this.hasPresentedSyncUI = this.nativeModule.hasPresentedSyncUI();
      this.healthKitInterfaceEnabledForCurrentUser = this.nativeModule.healthKitInterfaceEnabledForCurrentUser();
      this.healthKitInterfaceConfiguredForOtherUser = this.nativeModule.healthKitInterfaceConfiguredForOtherUser();
      this.currentHealthKitUsername = this.nativeModule.currentHealthKitUsername();

      const uploaderProgress = this.nativeModule.uploaderProgress();
      this.isUploadingHistorical = uploaderProgress.isUploadingHistorical;
      this.historicalUploadCurrentDay =
        uploaderProgress.historicalUploadCurrentDay;
      this.historicalUploadTotalDays =
        uploaderProgress.historicalUploadTotalDays;
      this.updateHistoricalUploadCurrentDayIfComplete();
      this.lastCurrentUploadUiDescription =
        uploaderProgress.lastCurrentUploadUiDescription;

      const events = new NativeEventEmitter(NativeModules.TPNativeHealth);
      events.addListener("onTurnOnInterface", this.onTurnOnInterface);
      events.addListener("onTurnOffInterface", this.onTurnOffInterface);
      events.addListener(
        "onTurnOnHistoricalUpload",
        this.onTurnOnHistoricalUpload
      );
      events.addListener(
        "onTurnOffHistoricalUpload",
        this.onTurnOffHistoricalUpload
      );
      events.addListener("onUploadStatsUpdated", this.onUploadStatsUpdated);
    } catch (error) {
      // console.log(`error: ${error}`);
    }
  }

  enableHealthKitInterface() {
    try {
      this.nativeModule.enableHealthKitInterface();
    } catch (error) {
      // console.log(`error: ${error}`);
    }
  }

  disableHealthKitInterface() {
    try {
      this.nativeModule.disableHealthKitInterface();
    } catch (error) {
      // console.log(`error: ${error}`);
    }
  }

  setHasPresentedSyncUI() {
    try {
      this.nativeModule.setHasPresentedSyncUI();
      this.hasPresentedSyncUI = true;
    } catch (error) {
      // console.log(`error: ${error}`);
    }
  }

  startUploadingHistorical() {
    try {
      this.historicalUploadCurrentDay = 0;
      this.historicalUploadTotalDays = 0;
      this.turnOffUploaderReason = "";
      this.turnOffUploaderError = "";
      this.notify("onUploadStatsUpdated", "historical");
      this.nativeModule.startUploadingHistorical();
    } catch (error) {
      // console.log(`error: ${error}`);
    }
  }

  stopUploadingHistoricalAndReset() {
    try {
      this.nativeModule.stopUploadingHistoricalAndReset();
    } catch (error) {
      // console.log(`error: ${error}`);
    }
  }

  onTurnOnInterface = params => {
    this.shouldShowHealthKitUI = params.shouldShowHealthKitUI;
    this.healthKitInterfaceEnabledForCurrentUser =
      params.healthKitInterfaceEnabledForCurrentUser;
    this.healthKitInterfaceConfiguredForOtherUser =
      params.healthKitInterfaceConfiguredForOtherUser;
    this.currentHealthKitUsername = params.currentHealthKitUsername;
    this.notify("onTurnOnInterface");
  };

  onTurnOffInterface = params => {
    this.shouldShowHealthKitUI = params.shouldShowHealthKitUI;
    this.healthKitInterfaceEnabledForCurrentUser =
      params.healthKitInterfaceEnabledForCurrentUser;
    this.healthKitInterfaceConfiguredForOtherUser =
      params.healthKitInterfaceConfiguredForOtherUser;
    this.currentHealthKitUsername = params.currentHealthKitUsername;
    this.notify("onTurnOffInterface");
  };

  onTurnOnHistoricalUpload = () => {
    this.isUploadingHistorical = true;
    this.turnOffUploaderReason = "";
    this.turnOffUploaderError = "";
    this.notify("onTurnOnHistoricalUpload");
  };

  onTurnOffHistoricalUpload = params => {
    this.isUploadingHistorical = false;
    this.turnOffUploaderReason = params.turnOffUploaderReason;

    let error = params.turnOffUploaderError;
    const errorPrefix = "error: ";
    const errorPrefixIndex = error.indexOf(errorPrefix);
    if (errorPrefixIndex !== -1) {
      error = error.slice(errorPrefixIndex + errorPrefix.length);
    }
    this.turnOffUploaderError = error;
    this.updateHistoricalUploadCurrentDayIfComplete();
    this.notify("onTurnOffHistoricalUpload");
  };

  onUploadStatsUpdated = params => {
    if (params.type === "historical") {
      this.isUploadingHistorical = params.isUploadingHistorical;
      this.historicalUploadCurrentDay = params.historicalUploadCurrentDay;
      this.historicalUploadTotalDays = params.historicalUploadTotalDays;
      this.updateHistoricalUploadCurrentDayIfComplete();
    } else if (params.type === "current") {
      this.lastCurrentUploadUiDescription =
        params.lastCurrentUploadUiDescription;
    }
    this.notify("onUploadStatsUpdated", params.type);
  };

  refreshUploadStats() {
    try {
      const uploaderProgress = this.nativeModule.uploaderProgress();
      this.isUploadingHistorical = uploaderProgress.isUploadingHistorical;
      this.historicalUploadCurrentDay =
        uploaderProgress.historicalUploadCurrentDay;
      this.historicalUploadTotalDays =
        uploaderProgress.historicalUploadTotalDays;
      this.updateHistoricalUploadCurrentDayIfComplete();
      this.lastCurrentUploadUiDescription =
        uploaderProgress.lastCurrentUploadUiDescription;
      this.notify("onUploadStatsUpdated", "historical");
      this.notify("onUploadStatsUpdated", "current");
    } catch (error) {
      // console.log(`error: ${error}`);
    }
  }

  updateHistoricalUploadCurrentDayIfComplete() {
    if (this.turnOffUploaderReason === "complete") {
      this.historicalUploadCurrentDay = this.historicalUploadTotalDays;
    }
  }

  addListener(listener) {
    this.listeners.push(listener);
  }

  removeListener(listener) {
    const index = this.listeners.indexOf(listener);
    if (index > 0) {
      this.listeners.splice(index, 1);
    }
  }

  notify(eventName, eventParams) {
    this.listeners.forEach(listener => listener(eventName, eventParams));
  }
}

const TPNativeHealth = new TPNativeHealthSingletonClass();

export { TPNativeHealth };
