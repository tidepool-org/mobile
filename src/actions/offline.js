const OFFLINE_SET = "OFFLINE_SET";

const offlineSet = isOffline => ({
  type: OFFLINE_SET,
  payload: isOffline,
});

export { offlineSet, OFFLINE_SET };
