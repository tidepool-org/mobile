// import { NativeModules } from "react-native";

import { appVersionLoad } from "./appVersion";
import { authRefreshTokenOrSignInAsync } from "./auth";
import { apiEnvironmentLoadAndSetAsync } from "./apiEnvironment";
import { apiCacheExpirationLoadAndSetAsync } from "./apiCacheExpiration";
import { graphRendererLoadAndSetAsync } from "./graphRenderer";
import { navigateLaunch } from "./navigation";
import getRouteName from "../navigators/getRouteName";
import { HEALTH_SYNC_ROUTE_NAME, DEBUG_HEALTH_ROUTE_NAME } from "../navigators/routeNames";
import GraphTextMeshFactory from "../components/Graph/gl/GraphTextMeshFactory";
import GraphCbgGl from "../components/Graph/gl/GraphCbgGl";
import GraphSmbgGl from "../components/Graph/gl/GraphSmbgGl";
import { firstTimeTipsLoadSettingsAsync } from "./firstTimeTips";
import { offlineSet } from "./offline";
import { ConnectionStatus } from "../models/ConnectionStatus";

const APP_INIT_DID_FINISH = "APP_INIT_DID_FINISH";

const appInitDidFinish = () => ({
  type: APP_INIT_DID_FINISH,
  payload: true,
});

const appInitAsync = () => async (dispatch, getState) => {
  // TODO: launch screen - activity indicator - revisit this now that we're using ExpoKit
  // if (!runTimeEnvironment.useExpo) {
  //   NativeModules.LaunchScreen.showActivityIndicator();
  // }

  dispatch(appVersionLoad());
  dispatch(offlineSet(ConnectionStatus.isOffline));
  dispatch(navigateLaunch());

  await dispatch(apiEnvironmentLoadAndSetAsync());
  await dispatch(apiCacheExpirationLoadAndSetAsync());
  await dispatch(graphRendererLoadAndSetAsync());
  await GraphTextMeshFactory.loadAssetsAsync();
  await GraphCbgGl.loadAssetsAsync();
  await GraphSmbgGl.loadAssetsAsync();
  await dispatch(firstTimeTipsLoadSettingsAsync());

  // Refresh token and navigate to home (or sign in) if transitioning from offline to online
  const connectionStatusListener = async ({
    wasOffline,
    isOffline,
    isOnline,
  }) => {
    dispatch(offlineSet(isOffline));
    if (wasOffline && isOnline) {
      const { navigation } = getState();
      if (navigation) {
        const { routeName } = getRouteName({ navigation });
        if (routeName !== HEALTH_SYNC_ROUTE_NAME && routeName !== DEBUG_HEALTH_ROUTE_NAME) {
          await dispatch(authRefreshTokenOrSignInAsync()); // This will navigateHome if refresh succeeds
        }
      }
    }
  };
  ConnectionStatus.addListener(connectionStatusListener);

  dispatch(authRefreshTokenOrSignInAsync());
  dispatch(appInitDidFinish());

  // TODO: launch screen - activity indicator - revisit this now that we're using ExpoKit
  // if (!runTimeEnvironment.useExpo) {
  //   NativeModules.LaunchScreen.hide();
  // }
};

export { appInitAsync, appInitDidFinish, APP_INIT_DID_FINISH };
