import { appVersionLoad } from "../actions/appVersion";
import { authRefreshTokenOrSignInAsync } from "../actions/auth";
import { apiEnvironmentLoadAndSetAsync } from "../actions/apiEnvironment";

export const appInitAsync = () => async dispatch => {
  dispatch(appVersionLoad());
  await dispatch(apiEnvironmentLoadAndSetAsync());
  dispatch(authRefreshTokenOrSignInAsync());
};
