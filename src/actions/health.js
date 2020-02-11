const HEALTH_STATE_SET = "HEALTH_STATE_SET";

const healthStateSet = payload => ({
  type: HEALTH_STATE_SET,
  payload,
});

export { healthStateSet, HEALTH_STATE_SET };
