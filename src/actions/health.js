import { TPNativeHealth } from "../models/TPNativeHealth";

const HEALTH_STATE_SET = "HEALTH_STATE_SET";

/* eslint-disable no-param-reassign */
// TODO: Revisit this. This is kind of a hack. This action creator side effect
// to start upload, if pending, is calculated based on payload and current
// state, and is "transient" / "auto-resetting" ... we should revisit this with
// a more elegant approach
const startUploadingSideEffect = (payload, state) => {
  const isTurningInterfaceOn =
    payload.isTurningInterfaceOn || state.health.isTurningInterfaceOn;
  const isInterfaceOn = payload.isInterfaceOn || state.health.isInterfaceOn;
  const isPendingUploadHistorical =
    payload.isPendingUploadHistorical || state.health.isPendingUploadHistorical;
  const isUploadingHistorical =
    payload.isUploadingHistorical || state.health.isUploadingHistorical;
  if (
    payload.isPendingUploadHistorical &&
    !isInterfaceOn &&
    !isTurningInterfaceOn
  ) {
    payload.isPendingUploadHistorical = false;
  } else if (isUploadingHistorical) {
    payload.isPendingUploadHistorical = false;
  } else if (isInterfaceOn && isPendingUploadHistorical) {
    TPNativeHealth.stopUploadingHistoricalAndReset(); // Reset uploader state so historical upload starts from beginning
    TPNativeHealth.startUploadingHistorical();
    payload.isPendingUploadHistorical = false; // Reset isPendingUploadHistorical since it is "transient" / "auto-resetting"
  }
};
/* eslint-enable no-param-reassign */

/* eslint-disable no-param-reassign */
const healthStateSet = payload => async (dispatch, getState) => {
  startUploadingSideEffect(payload, getState());

  dispatch({
    type: HEALTH_STATE_SET,
    payload,
  });
};
/* eslint-enable no-param-reassign */

export { healthStateSet, HEALTH_STATE_SET };
