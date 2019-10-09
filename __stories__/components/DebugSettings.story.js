/* eslint import/no-extraneous-dependencies: 0 */
import React from "react";
import { storiesOf } from "@storybook/react-native";

import StoryContainerScreen from "../utils/StoryContainerScreen";
import DebugSettingsScreen from "../../src/screens/DebugSettingsScreen";
import { API_ENVIRONMENT_STAGING } from "../../src/api";
import { API_CACHE_EXPIRATION_180_DAYS } from "../../src/api/TidepoolApiCacheControl";
import { GRAPH_RENDERER_THREE_JS } from "../../src/components/Graph/helpers";
import { Logger } from "../../src/models/Logger";

const props = {
  navigateGoBack: () => {},
  apiEnvironmentSetAndSaveAsync: () => {},
  apiCacheExpirationSetAndSaveAsync: () => {},
  graphRendererSetAndSaveAsync: () => {},
  firstTimeTipsResetTips: () => {},
  navigateDebugHealthScreen: () => {},
  logLevelSetAndSaveAsync: () => {},

  selectedApiEnvironment: API_ENVIRONMENT_STAGING,
  selectedApiCacheExpiration: API_CACHE_EXPIRATION_180_DAYS,
  selectedGraphRenderer: GRAPH_RENDERER_THREE_JS,
  selectedLogLevel: Logger.LOG_LEVEL_DEFAULT,
};

// TODO: stories - There are modal issues with the way this is shown. Can't
// dismiss it and it covers up the navigator stuff. Disable for now. Will
// address this as separate fix later. For now, can still re-enable this
// temporarily for targeted testing of the DebugSettings screen as needed.

// storiesOf("DebugSettingsScreen", module).add("default", () => (
//   <StoryContainerScreen>
//     <DebugSettingsScreen {...props} />
//   </StoryContainerScreen>
// ));
