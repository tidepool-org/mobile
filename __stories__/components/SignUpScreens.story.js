import React from "react";

import { storiesOf } from "@storybook/react-native";

import { View, Text } from "react-native";

import StoryContainerScreen from "../utils/StoryContainerScreen";
// import SignUpDiabetesDetailsScreen from "../../src/screens/SignUpDiabetesDetailsScreen";
// import SignUpDiabetesDetailsTwoScreen from "../../src/screens/SignUpDiabetesDetailsTwoScreen";

storiesOf("SignUpScreens", module).add("Diabetes Data", () => (
  <StoryContainerScreen>
    <View>
        <Text>Hello</Text>
    </View>
  </StoryContainerScreen>
));

storiesOf("SignUpScreens", module).add("Diabetes Data 2", () => (
  <StoryContainerScreen>
      <View>
        <Text>Hello</Text>
      </View>
  </StoryContainerScreen>
));
