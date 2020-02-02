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
  isPendingUploadHistorical: false,
  isUploadingHistorical: false,
  historicalUploadCurrentDay: 0,
  historicalUploadTotalDays: 0,
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
