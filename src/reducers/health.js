import {
  SHOULD_SHOW_HEALTH_KIT_UI_SET,
  HEALTH_KIT_INTERFACE_ENABLED_FOR_CURRENT_USER_SET,
  HEALTH_KIT_INTERFACE_CONFIGURED_FOR_OTHER_USER_SET,
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
    case SHOULD_SHOW_HEALTH_KIT_UI_SET:
      nextState = { ...state, shouldShowHealthKitUI: action.payload };
      break;
    case HEALTH_KIT_INTERFACE_ENABLED_FOR_CURRENT_USER_SET:
      nextState = {
        ...state,
        healthKitInterfaceEnabledForCurrentUser: action.payload,
      };
      break;
    case HEALTH_KIT_INTERFACE_CONFIGURED_FOR_OTHER_USER_SET:
      nextState = {
        ...state,
        healthKitInterfaceConfiguredForOtherUser: action.payload,
      };
      break;
    case IS_UPLOADING_HISTORICAL_SET:
      nextState = { ...state, ...action.payload };
      break;
    default:
      break;
  }

  return nextState;
}

export default health;
