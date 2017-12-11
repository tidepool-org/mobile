import React from "react";
import { storiesOf } from "@storybook/react-native";

import { StoryContainerScreen } from "../../__stories__/utils/StoryContainer";
import SignInScreen from "../../src/screens/SignInScreen";

const navigation = {
  dispatch: () => {},
};

storiesOf("SignInScreen", module).add("default", () => (
  <StoryContainerScreen>
    <SignInScreen navigation={navigation} />
  </StoryContainerScreen>
));

storiesOf("SignInScreen", module).add("sign in error", () => (
  <StoryContainerScreen>
    <SignInScreen
      navigation={navigation}
      errorMessage="Wrong email or password!"
    />
  </StoryContainerScreen>
));
