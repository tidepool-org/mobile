import React from "react";
import { storiesOf } from "@storybook/react-native";

import { StoryContainerComponent } from "../../__stories__/utils/StoryContainer";
import SignInForm from "../../src/components/SignInForm";

const props = {
  authSignInAsync: () => {},
  navigateForgotPassword: () => {},
};

storiesOf("SignInForm", module).add("default", () => (
  <StoryContainerComponent>
    <SignInForm {...props} />
  </StoryContainerComponent>
));

// TODO: storybook - should probably only test non-connected components in storybook, so we should have a non-connected version of SignInForm
storiesOf("SignInForm", module).add("sign in error", () => (
  <StoryContainerComponent>
    <SignInForm errorMessage="Wrong email or password!" {...props} />
  </StoryContainerComponent>
));
