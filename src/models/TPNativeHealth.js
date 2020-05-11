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
      uploaderLimitsIndex: 0,
      uploaderTimeoutsIndex: 0,
      uploaderSuppressDeletes: false,
      uploaderSimulate: false,
      includeSensitiveInfo: false,
      includeCFNetworkDiagnostics: false,
      shouldLogHealthData: false,
      useLocalNotificationDebug: false,
    };

    this.isUploadingHistorical = false;
    this.isHistoricalUploadPending = false;
    this.historicalUploadCurrentDay = 0;
    this.historicalTotalDaysCount = 0;
    this.historicalUploadTotalSamples = 0;
    this.historicalUploadTotalDeletes = 0;
    this.historicalUploadEarliestSampleTime = "";
    this.historicalUploadLatestSampleTime = "";
    this.historicalEndAnchorTime = "";
    this.turnOffHistoricalUploaderReason = "";
    this.turnOffHistoricalUploaderError = "";
    this.isUploadingHistoricalRetry = false;
    this.retryHistoricalUploadReason = "";
    this.retryHistoricalUploadError = "";
    this.historicalUploadLimitsIndex = 0;
    this.historicalUploadMaxLimitsIndex = 0;
    this.historicalTotalSamplesCount = 0;

    this.isUploadingCurrent = false;
    this.currentUploadTotalSamples = 0;
    this.currentUploadTotalDeletes = 0;
    this.currentUploadEarliestSampleTime = "";
    this.currentUploadLatestSampleTime = "";
    this.currentStartAnchorTime = "";
    this.turnOffCurrentUploaderReason = "";
    this.turnOffCurrentUploaderError = "";
    this.isUploadingCurrentRetry = false;
    this.retryCurrentUploadReason = "";
    this.retryCurrentUploadError = "";
    this.currentUploadLimitsIndex = 0;
    this.currentUploadMaxLimitsIndex = 0;
    this.lastCurrentUploadUiDescription = "";

    this.listeners = [];

    try {
      this.nativeModule = NativeModules.TPNativeHealth;

      this.healthKitInterfaceConfiguration = this.nativeModule.healthKitInterfaceConfiguration();

      const events = new NativeEventEmitter(NativeModules.TPNativeHealth);
      events.addListener(
        "onHealthKitInterfaceConfiguration",
        this.onHealthKitInterfaceConfiguration
      );
      events.addListener("onTurnOnUploader", this.onTurnOnUploader);
      events.addListener("onTurnOffUploader", this.onTurnOffUploader);
      events.addListener("onUploadHistoricalPending", this.onUploadHistoricalPending);
      events.addListener("onRetryUpload", this.onRetryUpload);
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
    } catch (error) {
      // console.log(`error: ${error}`);
    }
  }

  setUploaderLimitsIndex(index) {
    try {
      this.nativeModule.setUploaderLimitsIndex(index);
    } catch (error) {
      // console.log(`error: ${error}`);
    }
  }

  setUploaderTimeoutsIndex(index) {
    try {
      this.nativeModule.setUploaderTimeoutsIndex(index);
    } catch (error) {
      // console.log(`error: ${error}`);
    }
  }

  setUploaderSuppressDeletes(suppress) {
    try {
      this.nativeModule.setUploaderSuppressDeletes(suppress);
    } catch (error) {
      // console.log(`error: ${error}`);
    }
  }

  setUploaderSimulate(simulate) {
    try {
      this.nativeModule.setUploaderSimulate(simulate);
    } catch (error) {
      // console.log(`error: ${error}`);
    }
  }

  setUploaderIncludeSensitiveInfo(includeSensitiveInfo) {
    try {
      this.nativeModule.setUploaderIncludeSensitiveInfo(includeSensitiveInfo);
    } catch (error) {
      // console.log(`error: ${error}`);
    }
  }

  setUploaderIncludeCFNetworkDiagnostics(includeCFNetworkDiagnostics) {
    try {
      this.nativeModule.setUploaderIncludeCFNetworkDiagnostics(
        includeCFNetworkDiagnostics
      );
    } catch (error) {
      // console.log(`error: ${error}`);
    }
  }

  setUploaderShouldLogHealthData(shouldLogHealthData) {
    try {
      this.nativeModule.setUploaderShouldLogHealthData(shouldLogHealthData);
    } catch (error) {
      // console.log(`error: ${error}`);
    }
  }

  setUploaderUseLocalNotificationDebug(useLocalNotificationDebug) {
    try {
      this.nativeModule.setUploaderUseLocalNotificationDebug(useLocalNotificationDebug);
    } catch (error) {
      // console.log(`error: ${error}`);
    }
  }

  startUploadingHistorical() {
    try {
      this.historicalTotalSamplesCount = 0;
      this.historicalTotalDaysCount = 0;
      this.historicalUploadCurrentDay = 0;
      this.historicalUploadTotalSamples = 0;
      this.historicalUploadTotalDeletes = 0;
      this.turnOffHistoricalUploaderReason = "";
      this.turnOffHistoricalUploaderError = "";
      this.nativeModule.stopUploadingHistoricalAndReset();
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

  resetCurrentUploader() {
    try {
      this.nativeModule.resetCurrentUploader();
    } catch (error) {
      // console.log(`error: ${error}`);
    }
  }

  onHealthKitInterfaceConfiguration = (params) => {
    this.healthKitInterfaceConfiguration = { ...params };
    this.notify("onHealthKitInterfaceConfiguration");
  };

  onTurnOnUploader = (params) => {
    if (params.mode === "historical") {
      this.isUploadingHistorical = true;
      this.isUploadingHistoricalRetry = false;
      this.isHistoricalUploadPending = false;
      this.historicalUploadLimitsIndex = params.historicalUploadLimitsIndex;
      this.historicalUploadMaxLimitsIndex = params.historicalUploadMaxLimitsIndex;
      this.historicalEndAnchorTime = params.historicalEndAnchorTime;
      this.historicalTotalSamplesCount = params.historicalTotalSamplesCount;
      this.historicalTotalDaysCount = params.historicalTotalDaysCount;
      this.turnOffHistoricalUploaderReason = "";
      this.turnOffHistoricalUploaderError = "";
    } else {
      this.isUploadingCurrent = true;
      this.isUploadingCurrentRetry = false;
      this.currentUploadLimitsIndex = params.currentUploadLimitsIndex;
      this.currentUploadMaxLimitsIndex = params.currentUploadMaxLimitsIndex;
      this.currentStartAnchorTime = params.currentStartAnchorTime;
      this.turnOffCurrentUploaderReason = "";
      this.turnOffCurrentUploaderError = "";
    }
    this.notify("onTurnOnUploader", params.mode);
  };

  onTurnOffUploader = (params) => {
    let error = params.turnOffUploaderError;
    const errorPrefix = "error: ";
    const errorPrefixIndex = error.indexOf(errorPrefix);
    if (errorPrefixIndex !== -1) {
      error = error.slice(errorPrefixIndex + errorPrefix.length);
    }
    if (params.mode === "historical") {
      this.isUploadingHistorical = false;
      this.isHistoricalUploadPending = false;
      this.isUploadingHistoricalRetry = false;
      this.historicalUploadLimitsIndex = params.historicalUploadLimitsIndex;
      this.historicalUploadMaxLimitsIndex =
        params.historicalUploadMaxLimitsIndex;
      this.turnOffHistoricalUploaderReason = params.turnOffUploaderReason;
      this.turnOffHistoricalUploaderError = error;
      this.updateHistoricalStatsIfComplete();
    } else {
      this.isUploadingCurrent = false;
      this.isUploadingCurrentRetry = false;
      this.currentUploadLimitsIndex = params.currentUploadLimitsIndex;
      this.currentUploadMaxLimitsIndex = params.currentUploadMaxLimitsIndex;
      this.turnOffCurrentUploaderReason = params.turnOffUploaderReason;
      this.turnOffCurrentUploaderError = error;
    }
    this.notify("onTurnOffUploader", params.mode);
  };

  onUploadHistoricalPending = (params) => {
    this.isHistoricalUploadPending = true
    this.historicalEndAnchorTime = params.historicalEndAnchorTime;
    this.historicalTotalSamplesCount = params.historicalTotalSamplesCount;
    this.historicalTotalDaysCount = params.historicalTotalDaysCount;
    this.turnOffHistoricalUploaderReason = "";
    this.turnOffHistoricalUploaderError = "";
    this.notify("onUploadHistoricalPending", params.mode);
  }

  onRetryUpload = (params) => {
    if (params.mode === "historical") {
      let error = params.retryHistoricalUploadError;
      const errorPrefix = "error: ";
      const errorPrefixIndex = error.indexOf(errorPrefix);
      if (errorPrefixIndex !== -1) {
        error = error.slice(errorPrefixIndex + errorPrefix.length);
      }
      this.isUploadingHistoricalRetry = params.isUploadingHistoricalRetry;
      this.retryHistoricalUploadReason = params.retryHistoricalUploadReason;
      this.retryHistoricalUploadError = error;
      this.historicalUploadLimitsIndex = params.historicalUploadLimitsIndex;
      this.historicalUploadMaxLimitsIndex = params.historicalUploadMaxLimitsIndex;
    } else {
      let error = params.retryCurrentUploadError;
      const errorPrefix = "error: ";
      const errorPrefixIndex = error.indexOf(errorPrefix);
      if (errorPrefixIndex !== -1) {
        error = error.slice(errorPrefixIndex + errorPrefix.length);
      }
      this.isUploadingCurrentRetry = params.isUploadingCurrentRetry;
      this.retryCurrentUploadReason = params.retryCurrentUploadReason;
      this.retryCurrentUploadError = error;
      this.currentUploadLimitsIndex = params.currentUploadLimitsIndex;
      this.currentUploadMaxLimitsIndex = params.currentUploadMaxLimitsIndex;
    }
    this.notify("onRetryUpload", params.mode);

    if (!this.isUploadingCurrentRetry) {
      this.onUploadStatsUpdated(params);
    }
  };

  onUploadStatsUpdated = (params) => {
    if (params.mode === "historical") {
      this.isUploadingHistorical = params.isUploadingHistorical;
      this.historicalTotalDaysCount = params.historicalTotalDaysCount;
      this.historicalTotalSamplesCount = params.historicalTotalSamplesCount;
      this.historicalUploadCurrentDay = params.historicalUploadCurrentDay;
      this.updateHistoricalStatsIfComplete();
      this.historicalUploadTotalSamples = params.historicalUploadTotalSamples;
      this.historicalUploadTotalDeletes = params.historicalUploadTotalDeletes;
      this.historicalUploadEarliestSampleTime = params.historicalUploadEarliestSampleTime;
      this.historicalUploadLatestSampleTime = params.historicalUploadLatestSampleTime;
      this.historicalEndAnchorTime = params.historicalEndAnchorTime;
      this.historicalUploadLimitsIndex = params.historicalUploadLimitsIndex;
      this.historicalUploadMaxLimitsIndex = params.historicalUploadMaxLimitsIndex;
    } else if (params.mode === "current") {
      this.isUploadingCurrent = params.isUploadingCurrent;
      this.currentUploadTotalSamples = params.currentUploadTotalSamples;
      this.currentUploadTotalDeletes = params.currentUploadTotalDeletes;
      this.currentUploadEarliestSampleTime = params.currentUploadEarliestSampleTime;
      this.currentUploadLatestSampleTime = params.currentUploadLatestSampleTime;
      this.currentStartAnchorTime = params.currentStartAnchorTime;
      this.currentUploadLimitsIndex = params.currentUploadLimitsIndex;
      this.currentUploadMaxLimitsIndex = params.currentUploadMaxLimitsIndex;
      this.lastCurrentUploadUiDescription = params.lastCurrentUploadUiDescription;
    }
    this.notify("onUploadStatsUpdated", params.mode);
  };

  refreshUploadStats() {
    try {
      const uploaderProgress = this.nativeModule.uploaderProgress();

      this.isUploadingHistorical = uploaderProgress.isUploadingHistorical;
      this.historicalUploadLimitsIndex = uploaderProgress.historicalUploadLimitsIndex;
      this.historicalUploadMaxLimitsIndex = uploaderProgress.historicalUploadMaxLimitsIndex;
      this.historicalUploadCurrentDay = uploaderProgress.historicalUploadCurrentDay;
      this.historicalTotalDaysCount = uploaderProgress.historicalTotalDaysCount;
      this.updateHistoricalStatsIfComplete();
      this.historicalUploadTotalSamples = uploaderProgress.historicalUploadTotalSamples;
      this.historicalUploadTotalDeletes = uploaderProgress.historicalUploadTotalDeletes;
      this.historicalUploadEarliestSampleTime = uploaderProgress.historicalUploadEarliestSampleTime;
      this.historicalUploadLatestSampleTime = uploaderProgress.historicalUploadLatestSampleTime;
      this.historicalEndAnchorTime = uploaderProgress.historicalEndAnchorTime;

      this.isUploadingCurrent = uploaderProgress.isUploadingCurrent;
      this.currentUploadLimitsIndex = uploaderProgress.currentUploadLimitsIndex;
      this.currentUploadMaxLimitsIndex = uploaderProgress.currentUploadMaxLimitsIndex;
      this.currentUploadTotalSamples = uploaderProgress.currentUploadTotalSamples;
      this.currentUploadTotalDeletes = uploaderProgress.currentUploadTotalDeletes;
      this.currentUploadEarliestSampleTime = uploaderProgress.currentUploadEarliestSampleTime;
      this.currentUploadLatestSampleTime = uploaderProgress.currentUploadLatestSampleTime;
      this.currentStartAnchorTime = uploaderProgress.currentStartAnchorTime;
      this.lastCurrentUploadUiDescription = uploaderProgress.lastCurrentUploadUiDescription;

      this.notify("onUploadStatsUpdated", "historical");
      this.notify("onUploadStatsUpdated", "current");
    } catch (error) {
      // console.log(`error: ${error}`);
    }
  }

  updateHistoricalStatsIfComplete() {
    if (this.turnOffHistoricalUploaderReason === "complete") {
      this.historicalUploadCurrentDay = this.historicalTotalDaysCount;
      this.historicalUploadTotalSamples = this.historicalTotalSamplesCount;
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
    this.listeners.forEach((listener) => listener(eventName, eventParams));
  }
}

const TPNativeHealth = new TPNativeHealthSingletonClass();

export { TPNativeHealth };
