import React from "react";
import View from "react-native";
import { storiesOf } from "@storybook/react-native";

import StoryContainerScreen from "../../__stories__/utils/StoryContainerScreen";
import DebugSettingsScreen from "../../src/screens/DebugSettingsScreen";
import { API_ENVIRONMENT_STAGING } from "../../src/api";

const props = {
  navigateGoBack: () => {},
  apiEnvironmentSetAndSaveAsync: () => {},
  selectedApiEnvironment: API_ENVIRONMENT_STAGING,
};

storiesOf("DebugSettingsScreen", module).add("default", () => (
  <StoryContainerScreen>
    <DebugSettingsScreen {...props} />
  </StoryContainerScreen>
));
