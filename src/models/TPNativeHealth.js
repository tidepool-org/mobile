import { NativeModules, NativeEventEmitter } from "react-native";

class TPNativeHealthSingletonClass {
  constructor() {
    this.shouldShowHealthKitUI = false;
    this.healthKitInterfaceEnabledForCurrentUser = false;
    this.healthKitInterfaceConfiguredForOtherUser = false;
    this.isUploadingHistorical = false;
    this.historicalUploadCurrentDay = 0;
    this.historicalTotalDays = 0;
    this.historicalTotalUploadCount = 0;
    this.turnOffUploaderReason = "";
    this.turnOffUploaderError = "";
    this.listeners = [];

    try {
      this.nativeModule = NativeModules.TPNativeHealth;

      this.shouldShowHealthKitUI = this.nativeModule.shouldShowHealthKitUI();
      this.healthKitInterfaceEnabledForCurrentUser = this.nativeModule.healthKitInterfaceEnabledForCurrentUser();
      this.healthKitInterfaceConfiguredForOtherUser = this.nativeModule.healthKitInterfaceConfiguredForOtherUser();

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

  startUploadingHistorical() {
    try {
      this.nativeModule.startUploadingHistorical();
    } catch (error) {
      // console.log(`error: ${error}`);
    }
  }

  stopUploadingHistorical() {
    try {
      this.nativeModule.stopUploadingHistoricalAndReset();
    } catch (error) {
      // console.log(`error: ${error}`);
    }
  }

  onTurnOnInterface = params => {
    this.healthKitInterfaceEnabledForCurrentUser =
      params.healthKitInterfaceEnabledForCurrentUser;
    this.healthKitInterfaceConfiguredForOtherUser =
      params.healthKitInterfaceConfiguredForOtherUser;

    this.notify("onTurnOnInterface", params);
  };

  onTurnOffInterface = params => {
    this.healthKitInterfaceEnabledForCurrentUser =
      params.healthKitInterfaceEnabledForCurrentUser;
    this.healthKitInterfaceConfiguredForOtherUser =
      params.healthKitInterfaceConfiguredForOtherUser;

    this.notify("onTurnOffInterface", params);
  };

  onTurnOnHistoricalUpload = params => {
    this.isUploadingHistorical = true;
    this.turnOffUploaderReason = "";
    this.turnOffUploaderError = "";
    this.notify("onTurnOnHistoricalUpload", params);
  };

  onTurnOffHistoricalUpload = params => {
    this.isUploadingHistorical = false;
    this.turnOffUploaderReason = params.turnOffUploaderReason;
    this.turnOffUploaderError = params.turnOffUploaderError;
    this.notify("onTurnOffHistoricalUpload", params);
  };

  onUploadStatsUpdated = params => {
    if (params.type === "historical") {
      this.isUploadingHistorical = params.isInProgress;
      this.historicalUploadCurrentDay = params.currentDay;
      this.historicalTotalDays = params.totalDays;
      this.historicalTotalUploadCount = params.totalUploadCount;
    }
    this.notify("onUploadStatsUpdated", params);
  };

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
