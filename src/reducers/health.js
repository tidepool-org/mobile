import { HEALTH_STATE_SET } from "../actions/health";

const initialState = {
  shouldShowHealthKitUI: false,
  isHealthKitAuthorized: false,
  isHealthKitInterfaceEnabledForCurrentUser: false,
  isHealthKitInterfaceConfiguredForOtherUser: false,
  currentHealthKitUsername: "",
  hasPresentedSyncUI: false,
  interfaceTurnedOffError: "",
  isTurningInterfaceOn: false,
  isInterfaceOn: false,

  isUploadingHistorical: false,
  isHistoricalUploadPending: false,
  historicalUploadCurrentDay: 0,
  historicalUploadTotalDays: 0,
  historicalUploadTotalSamples: 0,
  historicalUploadTotalDeletes: 0,
  turnOffHistoricalUploaderReason: "",
  turnOffHistoricalUploaderError: "",
  isUploadingHistoricalRetry: false,
  retryHistoricalUploadReason: "",
  retryHistoricalUploadError: "",
  historicalUploadLimitsIndex: 0,
  historicalUploadMaxLimitsIndex: 0,

  isUploadingCurrent: false,
  currentUploadTotalSamples: 0,
  currentUploadTotalDeletes: 0,
  turnOffCurrentUploaderReason: "",
  turnOffCurrentUploaderError: "",
  isUploadingCurrentRetry: false,
  retryCurrentUploadReason: "",
  retryCurrentUploadError: "",
  currentUploadLimitsIndex: 0,
  currentUploadMaxLimitsIndex: 0,
  lastCurrentUploadUiDescription: "",
};

function health(state = initialState, action) {
  let nextState = state;

  switch (action.type) {
    case HEALTH_STATE_SET:
      nextState = { ...state, ...action.payload };
      break;
    default:
      break;
  }

  return nextState;
}

export default health;
