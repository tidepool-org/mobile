import { AsyncStorage } from "react-native";
import { authSignOutAsync } from "./auth";
import { switchApiEnvironment, API_ENVIRONMENT_PRODUCTION } from "../api";

const API_ENVIRONMENT_SET = "API_ENVIRONMENT_SET";

const API_ENVIRONMENT_KEY = "API_ENVIRONMENT_KEY";

const apiEnvironmentSet = apiEnvironment => {
  switchApiEnvironment(apiEnvironment);

  return {
    type: API_ENVIRONMENT_SET,
    payload: apiEnvironment,
  };
};

const apiEnvironmentLoadAndSetAsync = () => async dispatch => {
  let apiEnvironment = API_ENVIRONMENT_PRODUCTION;
  try {
    apiEnvironment = await AsyncStorage.getItem(API_ENVIRONMENT_KEY);

    if (!apiEnvironment) {
      // console.log(
      //   `No apiEnvironment was saved, defaulting to ${API_ENVIRONMENT_PRODUCTION}`
      // );
      apiEnvironment = API_ENVIRONMENT_PRODUCTION;
    } else {
      // console.log(
      //   `apiEnvironmentLoadAndSetAsync succeeded, apiEnvironment: ${apiEnvironment}`
      // );
    }
  } catch (error) {
    // console.log(
    //   `Failed to load apiEnvironment, defaulting to ${API_ENVIRONMENT_PRODUCTION}, error: ${error}`
    // );
  }

  dispatch(apiEnvironmentSet(apiEnvironment));
};

const apiEnvironmentSetAndSaveAsync = apiEnvironment => async dispatch => {
  dispatch(authSignOutAsync());

  try {
    AsyncStorage.setItem(API_ENVIRONMENT_KEY, apiEnvironment);
    // console.log(
    //   `apiEnvironmentSetAndSaveAsync save succeeded, apiEnvironment: ${apiEnvironment}`
    // );
  } catch (error) {
    // console.log(
    //   `apiEnvironmentSetAndSaveAsync failed to save apiEnvironment, error: ${error}`
    // );
  }

  dispatch(apiEnvironmentSet(apiEnvironment));
};

export {
  apiEnvironmentSet,
  apiEnvironmentLoadAndSetAsync,
  apiEnvironmentSetAndSaveAsync,
  API_ENVIRONMENT_SET,
};
