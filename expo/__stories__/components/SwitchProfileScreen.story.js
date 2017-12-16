import React from "react";
import { storiesOf } from "@storybook/react-native";

import StoryContainerScreen from "../../__stories__/utils/StoryContainerScreen";
import SwitchProfileScreen from "../../src/screens/SwitchProfileScreen";

const props = {
  navigateGoBack: () => {},
};

storiesOf("SwitchProfileScreen", module).add("default", () => (
  <StoryContainerScreen>
    <SwitchProfileScreen {...props} />
  </StoryContainerScreen>
));
