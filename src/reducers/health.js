import {
  HEALTH_KIT_INTERFACE_SET,
  IS_UPLOADING_HISTORICAL_SET,
} from "../actions/health";

const initialState = {
  shouldShowHealthKitUI: false,
  healthKitInterfaceEnabledForCurrentUser: false,
  healthKitInterfaceConfiguredForOtherUser: false,
  isUploadingHistorical: false,
  historicalUploadCurrentDay: 0,
  historicalTotalDays: 0,
  historicalTotalUploadCount: 0,
};

function health(state = initialState, action) {
  let nextState = state;

  switch (action.type) {
    case HEALTH_KIT_INTERFACE_SET:
    case IS_UPLOADING_HISTORICAL_SET:
      nextState = { ...state, ...action.payload };
      break;
    default:
      break;
  }

  return nextState;
}

export default health;
