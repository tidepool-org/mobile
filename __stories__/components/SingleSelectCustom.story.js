import React from "react";

import { storiesOf } from "@storybook/react-native";

import { View } from "react-native";

import { SingleSelectCustom } from "../../src/components/SingleSelectCustom";

import StoryContainerComponent from "../utils/StoryContainerComponent";

storiesOf("SingleSelectCustom", module).add("default", () => (
  <StoryContainerComponent>
      <SingleSelectCustom />
  </StoryContainerComponent>
));
