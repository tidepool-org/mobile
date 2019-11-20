const HEALTH_KIT_INTERFACE_SET = "HEALTH_KIT_INTERFACE_SET";
const UPLOADER_STATE_SET = "UPLOADER_STATE_SET";

const healthKitInterfaceSet = payload => ({
  type: HEALTH_KIT_INTERFACE_SET,
  payload,
});

const uploaderStateSet = params => ({
  type: UPLOADER_STATE_SET,
  payload: params,
});

export {
  healthKitInterfaceSet,
  uploaderStateSet,
  HEALTH_KIT_INTERFACE_SET,
  UPLOADER_STATE_SET,
};
