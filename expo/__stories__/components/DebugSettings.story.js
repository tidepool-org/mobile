import React from "react";
import View from "react-native";
import { storiesOf } from "@storybook/react-native";

import StoryContainerScreen from "../../__stories__/utils/StoryContainerScreen";
import DebugSettingsScreen from "../../src/screens/DebugSettingsScreen";
import { ENVIRONMENT_STAGING } from "../../src/api";

const props = {
  navigateGoBack: () => {},
  environmentSignOutAndSetCurrentEnvironmentAsync: () => {},
  selectedEnvironment: ENVIRONMENT_STAGING,
};

storiesOf("DebugSettingsScreen", module).add("default", () => (
  <StoryContainerScreen>
    <DebugSettingsScreen {...props} />
  </StoryContainerScreen>
));
