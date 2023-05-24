/* eslint import/no-extraneous-dependencies: 0 */
import React from "react";

import StoryContainerComponent from "../utils/StoryContainerComponent";
import SignInForm from "../../src/components/SignInForm";

const props = {
  authSignInAsync: () => {},
  authSignInReset: () => {},
  navigateForgotPassword: () => {},
  signingIn: false,
};

export default {
  title: 'SignInForm',
};

export const Default = () => (
  <StoryContainerComponent>
    <SignInForm {...props} />
  </StoryContainerComponent>
);

Default.story = {
  name: 'default',
};

export const SignInError = () => (
  <StoryContainerComponent>
    <SignInForm {...props} errorMessage="Wrong email or password!" />
  </StoryContainerComponent>
);

SignInError.story = {
  name: 'Sign in error',
};
export const SigningIn = () => (
  <StoryContainerComponent>
    <SignInForm {...props} signingIn />
  </StoryContainerComponent>
);

SigningIn.story = {
  name: 'Signing in',
};
