/* eslint import/no-extraneous-dependencies: 0 */
import React from "react";

import StoryContainerScreen from "../utils/StoryContainerScreen";
import SignInScreen from "../../src/screens/SignInScreen";
import { API_ENVIRONMENT_QA2 } from "../../src/api";

const props = {
  navigateSignUp: () => {},
  navigateDebugSettings: () => {},
  navigateForgotPassword: () => {},
  authSignInReset: () => {},
  authSignInAsync: () => {},
  signingIn: false,
  version: "3.1.1",
  apiEnvironment: API_ENVIRONMENT_QA2,
  errorMessage: "",
};

export default {
  title: 'SignInScreen',
};

export const Default = () => (
  <StoryContainerScreen>
    <SignInScreen {...props} />
  </StoryContainerScreen>
);

Default.story = {
  name: 'default',
};

export const SignInError = () => (
  <StoryContainerScreen>
    <SignInScreen {...props} errorMessage="Wrong email or password!" />
  </StoryContainerScreen>
);

SignInError.story = {
  name: 'Sign in error',
};

export const SigningIn = () => (
  <StoryContainerScreen>
    <SignInScreen {...props} signingIn />
  </StoryContainerScreen>
);

SigningIn.story = {
  name: 'Signing in',
};
