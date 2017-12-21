import { AsyncStorage } from "react-native";
import { authSignOutAsync } from "../actions/auth";
import { switchApiEnvironment, API_ENVIRONMENT_PRODUCTION } from "../api";

export const API_ENVIRONMENT_SET = "API_ENVIRONMENT_SET";

const API_ENVIRONMENT_KEY = "API_ENVIRONMENT_KEY";

export const apiEnvironmentSet = apiEnvironment => {
  switchApiEnvironment(apiEnvironment);

  return {
    type: API_ENVIRONMENT_SET,
    payload: apiEnvironment,
  };
};

export const apiEnvironmentLoadAndSetAsync = () => async dispatch => {
  let apiEnvironment = API_ENVIRONMENT_PRODUCTION;
  try {
    apiEnvironment = await AsyncStorage.getItem(API_ENVIRONMENT_KEY);

    if (!apiEnvironment) {
      // console.log(
      //   `No apiEnvironment was saved, defaulting to ${API_ENVIRONMENT_PRODUCTION}`
      // );
      apiEnvironment = API_ENVIRONMENT_PRODUCTION;
    }
    // console.log(
    //   `apiEnvironmentLoadAndSetAsync succeeded, apiEnvironment: ${apiEnvironment}`
    // );
  } catch (error) {
    // console.log(
    //   `Failed to load apiEnvironment, defaulting to ${API_ENVIRONMENT_PRODUCTION}, error: ${error}`
    // );
    apiEnvironment = API_ENVIRONMENT_PRODUCTION;
  }

  dispatch(apiEnvironmentSet(apiEnvironment));
};

export const apiEnvironmentSetAndSaveAsync = apiEnvironment => async dispatch => {
  dispatch(authSignOutAsync());

  try {
    await AsyncStorage.setItem(API_ENVIRONMENT_KEY, apiEnvironment);
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
