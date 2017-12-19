import React from "react";
import { storiesOf } from "@storybook/react-native";

import StoryContainerScreen from "../../__stories__/utils/StoryContainerScreen";
import SignInScreen from "../../src/screens/SignInScreen";
import { ENVIRONMENT_STAGING } from "../../src/api";

const props = {
  navigateSignUp: () => {
    console.log("navigateSignUp");
  },
  navigateDebugSettings: () => {
    console.log("navigateDebugSettings");
  },
  navigateForgotPassword: () => {
    console.log("navigateForgotPassword");
  },
  authSignInReset: () => {
    console.log("authSignInReset");
  },
  authSignInAsync: () => {
    console.log("authSignInAsync");
  },
  signingIn: false,
  version: "3.0.0",
  environment: ENVIRONMENT_STAGING,
  errorMessage: "",
};

storiesOf("SignInScreen", module).add("default", () => (
  <StoryContainerScreen>
    <SignInScreen {...props} />
  </StoryContainerScreen>
));

storiesOf("SignInScreen", module).add("Sign in error", () => (
  <StoryContainerScreen>
    <SignInScreen {...props} errorMessage="Wrong email or password!" />
  </StoryContainerScreen>
));

storiesOf("SignInScreen", module).add("Signing in", () => (
  <StoryContainerScreen>
    <SignInScreen {...props} signingIn />
  </StoryContainerScreen>
));
