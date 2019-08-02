/* eslint import/no-extraneous-dependencies: 0 */
import React from "react";
import { storiesOf } from "@storybook/react-native";
import { Text } from "react-native";

import StoryContainerScreen from "../utils/StoryContainerScreen";
// import SignInScreen from "../../src/screens/SignInScreen";
// import { API_ENVIRONMENT_STAGING } from "../../src/api";

// const props = {
//   navigateSignUp: () => {},
//   navigateDebugSettings: () => {},
//   navigateForgotPassword: () => {},
//   authSignInReset: () => {},
//   authSignInAsync: () => {},
//   signingIn: false,
//   version: "3.0.4",
//   apiEnvironment: API_ENVIRONMENT_STAGING,
//   errorMessage: "",
// };

storiesOf("SignUpScreen", module).add("Diabetes Data 2", () => (
  <StoryContainerScreen>
    <Text>Diabetes Data 2</Text>
  </StoryContainerScreen>
));

storiesOf("SignUpScreen", module).add("Diabetes Data", () => (
  <StoryContainerScreen>
    <Text>Diabetes Data</Text>
  </StoryContainerScreen>
));
