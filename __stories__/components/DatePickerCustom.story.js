import React from "react";
import { storiesOf } from "@storybook/react-native";
import StoryContainerComponent from "../utils/StoryContainerComponent";
import { View, Text } from "react-native";
import { DatePickerCustom } from "../../src/components/DatePickerCustom";

storiesOf("DatePickerCustom", module).add("default", () => (
  <StoryContainerComponent>
    <View>
      <Text>DatePickerCustom</Text>
    </View>
  </StoryContainerComponent>
));