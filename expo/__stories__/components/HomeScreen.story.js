import React from "react";
import { storiesOf } from "@storybook/react-native";

import { StoryContainerScreen } from "../../__stories__/utils/StoryContainer";
import HomeScreen from "../../src/screens/HomeScreen";

const navigation = {
  dispatch: () => {},
};

storiesOf("HomeScreen", module).add("default", () => (
  <StoryContainerScreen>
    <HomeScreen navigation={navigation} />
  </StoryContainerScreen>
));
