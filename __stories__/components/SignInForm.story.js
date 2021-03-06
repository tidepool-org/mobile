/* eslint import/no-extraneous-dependencies: 0 */
import React from "react";
import { storiesOf } from "@storybook/react-native";

import StoryContainerComponent from "../utils/StoryContainerComponent";
import SignInForm from "../../src/components/SignInForm";

const props = {
  authSignInAsync: () => {},
  authSignInReset: () => {},
  navigateForgotPassword: () => {},
  signingIn: false,
};

storiesOf("SignInForm", module).add("default", () => (
  <StoryContainerComponent>
    <SignInForm {...props} />
  </StoryContainerComponent>
));

storiesOf("SignInForm", module).add("Sign in error", () => (
  <StoryContainerComponent>
    <SignInForm {...props} errorMessage="Wrong email or password!" />
  </StoryContainerComponent>
));

storiesOf("SignInForm", module).add("Signing in", () => (
  <StoryContainerComponent>
    <SignInForm {...props} signingIn />
  </StoryContainerComponent>
));
