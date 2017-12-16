import React from "react";
import { storiesOf } from "@storybook/react-native";

import StoryContainerScreen from "../../__stories__/utils/StoryContainerScreen";
import SignInScreen from "../../src/screens/SignInScreen";

const props = {
  navigateSignUp: () => {},
};

storiesOf("SignInScreen", module).add("default", () => (
  <StoryContainerScreen>
    <SignInScreen {...props} />
  </StoryContainerScreen>
));

// TODO: storybook - SignInScreen currently has a SignInFormContainer which gets errorMessage from redux. Need to revisit
// this to better test in storybook. Either handle this in storybook via actions, or maybe look at lifting the state
// from SignInForm to SignInScreen and getting rid of SignInFormContainer, or something like that
storiesOf("SignInScreen", module).add("sign in error", () => (
  <StoryContainerScreen>
    <SignInScreen {...props} errorMessage="Wrong email or password!" />
  </StoryContainerScreen>
));
