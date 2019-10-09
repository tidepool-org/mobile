import { AsyncStorage } from "react-native";

import { Logger } from "../models/Logger";

const LOG_LEVEL_SET = "LOG_LEVEL_SET";
const LOG_LEVEL_KEY = "LOG_LEVEL_KEY";

const logLevels = [
  Logger.LOG_LEVEL_DEBUG,
  Logger.LOG_LEVEL_INFO,
  Logger.LOG_LEVEL_WARNING,
  Logger.LOG_LEVEL_ERROR,
];

const logLevelSet = logLevel => ({
  type: LOG_LEVEL_SET,
  payload: logLevel,
});

const logLevelLoadAndSetAsync = () => async dispatch => {
  let logLevel = Logger.LOG_LEVEL_DEFAULT;
  try {
    logLevel = await AsyncStorage.getItem(LOG_LEVEL_KEY);

    if (!logLevel || !logLevels.includes(logLevel)) {
      // console.log(
      //   `No logLevel was saved, defaulting to ${Logger.LOG_LEVEL_DEFAULT}`
      // );
      logLevel = Logger.LOG_LEVEL_DEFAULT;
    } else {
      // console.log(
      //   `logLevelLoadAndSetAsync succeeded, logLevel: ${logLevel}`
      // );
    }
  } catch (error) {
    // console.log(
    //   `Failed to load logLevel, defaulting to ${
    //     Logger.LOG_LEVEL_DEFAULT
    //   }, error: ${error}`
    // );
  }

  dispatch(logLevelSet(logLevel));
};

const logLevelSetAndSaveAsync = logLevel => async dispatch => {
  try {
    AsyncStorage.setItem(LOG_LEVEL_KEY, logLevel);
    // console.log(
    //   `logLevelSetAndSaveAsync save succeeded, logLevel: ${logLevel}`
    // );
  } catch (error) {
    Logger.logError(
      `logLevelSetAndSaveAsync failed to save logLevel, error: ${error}`
    );
  }

  dispatch(logLevelSet(logLevel));
};

export {
  logLevelSet,
  logLevelLoadAndSetAsync,
  logLevelSetAndSaveAsync,
  LOG_LEVEL_SET,
};
