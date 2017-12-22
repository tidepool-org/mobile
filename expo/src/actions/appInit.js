import { NativeModules } from "react-native";
import { appVersionLoad } from "../actions/appVersion";
import { authRefreshTokenOrSignInAsync } from "../actions/auth";
import { apiEnvironmentLoadAndSetAsync } from "../actions/apiEnvironment";
import { navigateLaunch } from "../actions/navigation";
import environment from "../utils/runtimeEnvironment";

export const APP_INIT_DID_FINISH = "APP_INIT_DID_FINISH";

export const appInitDidFinish = () => ({
  type: APP_INIT_DID_FINISH,
  payload: true,
});

export const appInitAsync = () => async dispatch => {
  if (!environment.useExpo) {
    NativeModules.LaunchScreen.showActivityIndicator();
  }

  dispatch(navigateLaunch());
  dispatch(appVersionLoad());
  await dispatch(apiEnvironmentLoadAndSetAsync());
  await dispatch(authRefreshTokenOrSignInAsync());
  dispatch(appInitDidFinish());

  if (!environment.useExpo) {
    NativeModules.LaunchScreen.hide();
  }
};
