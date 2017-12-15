import React from "react";
import { storiesOf } from "@storybook/react-native";

import { StoryContainerScreen } from "../../__stories__/utils/StoryContainer";
import SignInScreen from "../../src/screens/SignInScreen";

storiesOf("SignInScreen", module).add("default", () => (
  <StoryContainerScreen>
    <SignInScreen />
  </StoryContainerScreen>
));

// TODO: storybook - should probably only test non-connected components in storybook, so, we should have a screen which is layout, etc, and a screen container or connected screen which connects to the store
storiesOf("SignInScreen", module).add("sign in error", () => (
  <StoryContainerScreen>
    <SignInScreen errorMessage="Wrong email or password!" />
  </StoryContainerScreen>
));