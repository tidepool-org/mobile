import React from "react";
import { storiesOf } from "@storybook/react-native";
import StoryContainerScreen from "../utils/StoryContainerScreen";

import SignUpScreen from "../../src/screens/SignUpScreen";
import SignUpCreateAccountPersonalScreen from "../../src/screens/SignUpCreateAccountPersonalScreen";

import SignUpTermsOfUseScreen from "../../src/screens/SignUpTermsOfUseScreen";
import SignUpDiabetesDetailsScreen from "../../src/screens/SignUpDiabetesDetailsScreen";
import SignUpDiabetesDetailsTwoScreen from "../../src/screens/SignUpDiabetesDetailsTwoScreen";

storiesOf("SignUpScreens", module).add("Sign Up", () => (
  <StoryContainerScreen>
    <SignUpScreen />
  </StoryContainerScreen>
));

storiesOf("SignUpScreens", module).add("Create Account Personal", () => (
  <StoryContainerScreen>
    <SignUpCreateAccountPersonalScreen />
  </StoryContainerScreen>
));

storiesOf("SignUpScreens", module).add("Terms of Use", () => (
  <StoryContainerScreen>
    <SignUpTermsOfUseScreen />
  </StoryContainerScreen>
));

storiesOf("SignUpScreens", module).add("Diabetes Details", () => (
  <StoryContainerScreen>
    <SignUpDiabetesDetailsScreen />
  </StoryContainerScreen>
));

// storiesOf("SignUpScreens", module).add("Diabetes Details 2", () => (
//   <StoryContainerScreen>
//     <SignUpDiabetesDetailsTwoScreen />
//   </StoryContainerScreen>
// ));
