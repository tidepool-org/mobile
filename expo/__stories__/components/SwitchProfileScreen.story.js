import React from "react";
import { storiesOf } from "@storybook/react-native";

import { StoryContainerScreen } from "../../__stories__/utils/StoryContainer";
import SwitchProfileScreen from "../../src/screens/SwitchProfileScreen";

const navigation = {
  navigate: () => {},
  dispatch: () => {},
  goBack: () => {},
};

storiesOf("SwitchProfileScreen", module).add("default", () => (
  <StoryContainerScreen>
    <SwitchProfileScreen navigation={navigation} />
  </StoryContainerScreen>
));
