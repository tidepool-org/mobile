import React from "react";

import { storiesOf } from "@storybook/react-native";

import { View, Text } from "react-native";

import RNPickerSelect from "react-native-picker-select";

import StoryContainerComponent from "../utils/StoryContainerComponent";

storiesOf("SingleSelectCustom", module).add("default", () => (
  <StoryContainerComponent>
    <View
      style={{
        width: 300,
      }}
    >
      <Text>Hello Picker</Text>
    </View>

    
  </StoryContainerComponent>
));
