import React from "react";
import { storiesOf } from "@storybook/react-native";

import { StoryContainerComponent } from "../../__stories__/utils/StoryContainer";
import SignInForm from "../../src/components/SignInForm";

const navigation = {
  navigate: () => {},
  dispatch: () => {},
  goBack: () => {},
};

storiesOf("SignInForm", module).add("default", () => (
  <StoryContainerComponent>
    <SignInForm navigation={navigation} />
  </StoryContainerComponent>
));

storiesOf("SignInForm", module).add("login error", () => (
  <StoryContainerComponent>
    <SignInForm
      errorMessage="Wrong email or password!"
      navigation={navigation}
    />
  </StoryContainerComponent>
));
