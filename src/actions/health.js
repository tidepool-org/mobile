const SHOULD_SHOW_HEALTH_KIT_UI_SET = "SHOULD_SHOW_HEALTH_KIT_UI_SET";
const HEALTH_KIT_INTERFACE_ENABLED_FOR_CURRENT_USER_SET =
  "HEALTH_KIT_INTERFACE_ENABLED_FOR_CURRENT_USER_SET";
const HEALTH_KIT_INTERFACE_CONFIGURED_FOR_OTHER_USER_SET =
  "HEALTH_KIT_INTERFACE_CONFIGURED_FOR_OTHER_USER_SET";
const IS_UPLOADING_HISTORICAL_SET = "IS_UPLOADING_HISTORICAL_SET";

const shouldShowHealthKitUISet = shouldShowHealthKitUI => ({
  type: SHOULD_SHOW_HEALTH_KIT_UI_SET,
  payload: shouldShowHealthKitUI,
});

const healthKitInterfaceEnabledForCurrentUserSet = healthKitInterfaceEnabledForCurrentUser => ({
  type: HEALTH_KIT_INTERFACE_ENABLED_FOR_CURRENT_USER_SET,
  payload: healthKitInterfaceEnabledForCurrentUser,
});

const healthKitInterfaceConfiguredForOtherUserSet = healthKitInterfaceConfiguredForOtherUser => ({
  type: HEALTH_KIT_INTERFACE_CONFIGURED_FOR_OTHER_USER_SET,
  payload: healthKitInterfaceConfiguredForOtherUser,
});

const isUploadingHistoricalSet = params => ({
  type: IS_UPLOADING_HISTORICAL_SET,
  payload: params,
});

export {
  shouldShowHealthKitUISet,
  healthKitInterfaceEnabledForCurrentUserSet,
  healthKitInterfaceConfiguredForOtherUserSet,
  isUploadingHistoricalSet,
  SHOULD_SHOW_HEALTH_KIT_UI_SET,
  HEALTH_KIT_INTERFACE_ENABLED_FOR_CURRENT_USER_SET,
  HEALTH_KIT_INTERFACE_CONFIGURED_FOR_OTHER_USER_SET,
  IS_UPLOADING_HISTORICAL_SET,
};
