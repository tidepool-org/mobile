/* eslint import/no-extraneous-dependencies: 0 */
import React from "react";
import { storiesOf } from "@storybook/react-native";

import StoryContainerScreen from "../utils/StoryContainerScreen";
import SignInScreen from "../../src/screens/SignInScreen";
import { API_ENVIRONMENT_STAGING } from "../../src/api";

const props = {
  navigateSignUp: () => {},
  navigateDebugSettings: () => {},
  navigateForgotPassword: () => {},
  authSignInReset: () => {},
  authSignInAsync: () => {},
  signingIn: false,
  version: "3.0.4",
  apiEnvironment: API_ENVIRONMENT_STAGING,
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
