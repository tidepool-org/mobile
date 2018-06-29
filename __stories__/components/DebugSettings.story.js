/* eslint import/no-extraneous-dependencies: 0 */
import React from "react";
import { storiesOf } from "@storybook/react-native";

import StoryContainerScreen from "../utils/StoryContainerScreen";
import DebugSettingsScreen from "../../src/screens/DebugSettingsScreen";
import { API_ENVIRONMENT_STAGING } from "../../src/api";
import { GRAPH_RENDERER_THREE_JS } from "../../src/components/Graph/helpers";

const props = {
  navigateGoBack: () => {},
  apiEnvironmentSetAndSaveAsync: () => {},
  firstTimeTipsResetTips: () => {},
  graphRendererSetAndSaveAsync: () => {},
  selectedApiEnvironment: API_ENVIRONMENT_STAGING,
  selectedGraphRenderer: GRAPH_RENDERER_THREE_JS,
};

storiesOf("DebugSettingsScreen", module).add("default", () => (
  <StoryContainerScreen>
    <DebugSettingsScreen {...props} />
  </StoryContainerScreen>
));
