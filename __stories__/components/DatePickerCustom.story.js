import React from "react";
import { storiesOf } from "@storybook/react-native";
import StoryContainerComponent from "../utils/StoryContainerComponent";

import { DatePickerCustom } from "../../src/components/DatePickerCustom";

storiesOf("DatePickerCustom", module).add("default", () => (
  <StoryContainerComponent>
    <DatePickerCustom />
  </StoryContainerComponent>
));