// TODO: uploader - use this for formatting health sync status for drawer and sync UI
const formatHealthSyncStatus = ({ health, isOffline, isDrawer }) => {
  const {
    isInterfaceOn,
    isTurningInterfaceOn,
    interfaceTurnedOffError,
    isUploadingHistorical,
    historicalUploadTotalSamples,
    historicalUploadCurrentDay,
    historicalUploadTotalDays,
    turnOffHistoricalUploaderReason,
    lastCurrentUploadUiDescription,
  } = health;

  // Drawer
  let syncStatusText = "";
  let syncProgressText = "";

  if (isOffline) {
    syncStatusText = "Upload paused while offline.";
  } else if (isTurningInterfaceOn) {
    syncStatusText = "Preparing to upload";
  } else if (isUploadingHistorical) {
    syncStatusText = "Syncing now";
  } else {
    syncStatusText = interfaceTurnedOffError;
  }

  const useItemCountInsteadOfDayCount = false
  if (isInterfaceOn && isDrawer && !isUploadingHistorical) {
    syncStatusText = lastCurrentUploadUiDescription;
    syncProgressText = "";
  } else if (useItemCountInsteadOfDayCount) {
    syncProgressText = `Uploaded ${historicalUploadTotalSamples} items`;
  } else if (historicalUploadCurrentDay > 0) {
    syncProgressText = `Day ${historicalUploadCurrentDay} of ${historicalUploadTotalDays}`;
  } else if (turnOffHistoricalUploaderReason === "complete") {
      // TODO: health - In the case of a relatively new user with only a day
      // or less of data to upload, this message will be confusing. We need to
      // also report on total samples uploaded, or use fractional days
      syncProgressText = "No data available to upload";
  }

  return {
    syncStatusText,
    syncProgressText,
  };
};

export { formatHealthSyncStatus };
