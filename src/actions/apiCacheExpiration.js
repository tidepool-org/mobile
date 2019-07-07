import { AsyncStorage } from "react-native";
import api from "../api";
import {
  API_CACHE_EXPIRATION_180_DAYS,
  getApiCacheExpirationSecondsFromName,
} from "../api/TidepoolApiCacheControl";
import Logger from "../models/Logger";

const API_CACHE_EXPIRATION_SET = "API_CACHE_EXPIRATION_SET";

const API_CACHE_EXPIRATION_KEY = "API_CACHE_EXPIRATION_KEY";

const apiCacheExpirationSet = apiCacheExpiration => {
  const apiCacheExpirationSeconds = getApiCacheExpirationSecondsFromName(
    apiCacheExpiration
  );
  api().cacheControl.setCacheExpirationSeconds(apiCacheExpirationSeconds);

  return {
    type: API_CACHE_EXPIRATION_SET,
    payload: apiCacheExpiration,
  };
};

const apiCacheExpirationLoadAndSetAsync = () => async dispatch => {
  let apiCacheExpiration = API_CACHE_EXPIRATION_180_DAYS;
  try {
    apiCacheExpiration = await AsyncStorage.getItem(API_CACHE_EXPIRATION_KEY);

    if (!apiCacheExpiration) {
      // console.log(
      //   `No apiCacheExpiration was saved, defaulting to ${API_CACHE_EXPIRATION_180_DAYS}`
      // );
      apiCacheExpiration = API_CACHE_EXPIRATION_180_DAYS;
    } else {
      // console.log(
      //   `apiCacheExpirationLoadAndSetAsync succeeded, apiCacheExpiration: ${apiCacheExpiration}`
      // );
    }
  } catch (error) {
    // console.log(
    //   `Failed to load apiCacheExpiration, defaulting to ${API_CACHE_EXPIRATION_180_DAYS}, error: ${error}`
    // );
  }

  dispatch(apiCacheExpirationSet(apiCacheExpiration));
};

const apiCacheExpirationSetAndSaveAsync = apiCacheExpiration => async dispatch => {
  try {
    AsyncStorage.setItem(API_CACHE_EXPIRATION_KEY, apiCacheExpiration);
    // console.log(
    //   `apiCacheExpirationSetAndSaveAsync save succeeded, apiCacheExpiration: ${apiCacheExpiration}`
    // );
  } catch (error) {
    Logger.logError(
      `apiCacheExpirationSetAndSaveAsync failed to save apiCacheExpiration, error: ${error}`
    );
  }

  dispatch(apiCacheExpirationSet(apiCacheExpiration));
};

export {
  apiCacheExpirationSet,
  apiCacheExpirationLoadAndSetAsync,
  apiCacheExpirationSetAndSaveAsync,
  API_CACHE_EXPIRATION_SET,
};
