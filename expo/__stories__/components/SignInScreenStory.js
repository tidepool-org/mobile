import React from "react";
import { storiesOf } from "@storybook/react-native";

import { StoryContainerScreen } from "../../__stories__/utils/StoryContainer";
import SignInScreen from "../../src/screens/SignInScreen";

storiesOf("SignInScreen", module).add("default", () => (
  <StoryContainerScreen>
    <SignInScreen />
  </StoryContainerScreen>
));

storiesOf("SignInScreen", module).add("login error", () => (
  <StoryContainerScreen>
    <SignInScreen errorMessage="Wrong email or password!" />
  </StoryContainerScreen>
));
