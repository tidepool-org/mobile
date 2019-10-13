const HEALTH_KIT_INTERFACE_SET = "HEALTH_KIT_INTERFACE_SET";
const IS_UPLOADING_HISTORICAL_SET = "IS_UPLOADING_HISTORICAL_SET";

const healthKitInterfaceSet = payload => ({
  type: HEALTH_KIT_INTERFACE_SET,
  payload,
});

const isUploadingHistoricalSet = params => ({
  type: IS_UPLOADING_HISTORICAL_SET,
  payload: params,
});

export {
  healthKitInterfaceSet,
  isUploadingHistoricalSet,
  HEALTH_KIT_INTERFACE_SET,
  IS_UPLOADING_HISTORICAL_SET,
};
