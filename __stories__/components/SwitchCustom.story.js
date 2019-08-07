import React from "react";

import { storiesOf } from "@storybook/react-native";
import { View, Text } from "react-native";
import { SwitchCustom } from "../../src/components/SwitchCustom";

import StoryContainerComponent from "../utils/StoryContainerComponent";

storiesOf("SwitchCustom", module).add("default", () => (
  <StoryContainerComponent>
    <View>
      <Text>Custom Switch Story</Text>
    </View>
  </StoryContainerComponent>
));
