import React from "react";
import { storiesOf } from "@storybook/react-native";

import { StoryContainerComponent } from "../../__stories__/utils/StoryContainer";
import SignInForm from "../../src/components/SignInForm";

// TODO: my - 0 - maybe move the stories and tests to top-level to avoid clutter for components?? also then removes that stupid index.js stuff
// TODO: my - 0 - can tests also be moved that high? We should try that, not sure if CRNA requires tests in src/ or not
// TODO: my - 0 - before committing this current set of changes, confirm we can do both stories and tests outside of src/ without issue

storiesOf("SignInForm", module).add("default", () => (
  <StoryContainerComponent>
    <SignInForm />
  </StoryContainerComponent>
));

storiesOf("SignInForm", module).add("login error", () => (
  <StoryContainerComponent>
    <SignInForm errorMessage="Wrong email or password!" />
  </StoryContainerComponent>
));
