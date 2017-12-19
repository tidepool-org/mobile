import { authSignOutAsync } from "../actions/auth";
import { switchEnvironment } from "../api";

export const ENVIRONMENT_SET_CURRENT_ENVIRONMENT =
  "ENVIRONMENT_SET_CURRENT_ENVIRONMENT";

export const environmentSetCurrentEnvironment = environment => {
  switchEnvironment(environment);

  return {
    type: ENVIRONMENT_SET_CURRENT_ENVIRONMENT,
    payload: environment,
  };
};

export const environmentSignOutAndSetCurrentEnvironmentAsync = environment => async dispatch => {
  dispatch(authSignOutAsync());
  dispatch(environmentSetCurrentEnvironment(environment));
};
