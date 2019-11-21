import {
  HEALTH_KIT_INTERFACE_SET,
  UPLOADER_STATE_SET,
} from "../actions/health";

const initialState = {
  shouldShowHealthKitUI: false,
  healthKitInterfaceEnabledForCurrentUser: false,
  healthKitInterfaceConfiguredForOtherUser: false,
  currentHealthKitUsername: "",
  isUploadingHistorical: false,
  historicalUploadCurrentDay: 0,
  historicalUploadTotalDays: 0,
  lastCurrentUploadUiDescription: "",
};

function health(state = initialState, action) {
  let nextState = state;

  switch (action.type) {
    case HEALTH_KIT_INTERFACE_SET:
    case UPLOADER_STATE_SET:
      nextState = { ...state, ...action.payload };
      break;
    default:
      break;
  }

  return nextState;
}

export default health;
