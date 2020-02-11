import { NativeModules, NativeEventEmitter } from "react-native";

class TPNativeHealthSingletonClass {
  constructor() {
    this.healthKitInterfaceConfiguration = {
      shouldShowHealthKitUI: false,
      isHealthKitAuthorized: false,
      isHealthKitInterfaceEnabledForCurrentUser: false,
      isHealthKitInterfaceConfiguredForOtherUser: false,
      currentHealthKitUsername: "",
      hasPresentedSyncUI: false,
      interfaceTurnedOffError: "",
      isTurningInterfaceOn: false,
      isInterfaceOn: false,
    };

    this.isHistoricalUploadPending = false;
    this.isUploadingHistorical = false;
    this.historicalUploadCurrentDay = 0;
    this.historicalUploadTotalDays = 0;
    this.lastCurrentUploadUiDescription = "";
    this.turnOffUploaderReason = "";
    this.turnOffUploaderError = "";

    this.listeners = [];

    try {
      this.nativeModule = NativeModules.TPNativeHealth;

      this.healthKitInterfaceConfiguration = this.nativeModule.healthKitInterfaceConfiguration();
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
      events.addListener(
        "onHealthKitInterfaceConfiguration",
        this.onHealthKitInterfaceConfiguration
      );
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

  enableHealthKitInterfaceAndAuthorize() {
    try {
      this.nativeModule.enableHealthKitInterfaceAndAuthorize();
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

  onHealthKitInterfaceConfiguration = params => {
    this.healthKitInterfaceConfiguration = { ...params };
    this.notify("onHealthKitInterfaceConfiguration");
  };

  onTurnOnHistoricalUpload = () => {
    this.isHistoricalUploadPending = false;
    this.isUploadingHistorical = true;
    this.turnOffUploaderReason = "";
    this.turnOffUploaderError = "";
    this.notify("onTurnOnHistoricalUpload");
  };

  onTurnOffHistoricalUpload = params => {
    this.isHistoricalUploadPending = false;
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
      this.isHistoricalUploadPending = params.isHistoricalUploadPending;
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
