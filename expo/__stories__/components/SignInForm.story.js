import React from "react";
import { storiesOf } from "@storybook/react-native";

import StoryContainerComponent from "../../__stories__/utils/StoryContainerComponent";
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

storiesOf("SignInForm", module).add("sign in error", () => (
  <StoryContainerComponent>
    <SignInForm errorMessage="Wrong email or password!" {...props} />
  </StoryContainerComponent>
));
