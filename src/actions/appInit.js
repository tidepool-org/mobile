// import { NativeModules } from "react-native";
import { appVersionLoad } from "./appVersion";
import { authRefreshTokenOrSignInAsync } from "./auth";
import { apiEnvironmentLoadAndSetAsync } from "./apiEnvironment";
import { graphRendererLoadAndSetAsync } from "./graphRenderer";
import { navigateLaunch } from "./navigation";
import GraphTextMeshFactory from "../components/Graph/gl/GraphTextMeshFactory";
import GraphCbgGl from "../components/Graph/gl/GraphCbgGl";
import GraphSmbgGl from "../components/Graph/gl/GraphSmbgGl";
import { firstTimeTipsLoadSettingsAsync } from "./firstTimeTips";

const APP_INIT_DID_FINISH = "APP_INIT_DID_FINISH";

const appInitDidFinish = () => ({
  type: APP_INIT_DID_FINISH,
  payload: true,
});

const appInitAsync = () => async dispatch => {
  // TODO: launch screen - activity indicator - revisit this now that we're using ExpoKit
  // if (!runTimeEnvironment.useExpo) {
  //   NativeModules.LaunchScreen.showActivityIndicator();
  // }

  dispatch(navigateLaunch());
  dispatch(appVersionLoad());

  await dispatch(graphRendererLoadAndSetAsync());
  await dispatch(apiEnvironmentLoadAndSetAsync());
  await dispatch(authRefreshTokenOrSignInAsync());

  await GraphTextMeshFactory.loadAssetsAsync();
  await GraphCbgGl.loadAssetsAsync();
  await GraphSmbgGl.loadAssetsAsync();

  await dispatch(firstTimeTipsLoadSettingsAsync());

  dispatch(appInitDidFinish());

  // TODO: launch screen - activity indicator - revisit this now that we're using ExpoKit
  // if (!runTimeEnvironment.useExpo) {
  //   NativeModules.LaunchScreen.hide();
  // }
};

export { appInitAsync, appInitDidFinish, APP_INIT_DID_FINISH };
