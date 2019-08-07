import React from "react";
import { storiesOf } from "@storybook/react-native";
import StoryContainerComponent from "../utils/StoryContainerComponent";

import { SwitchCustom } from "../../src/components/SwitchCustom";

storiesOf("SwitchCustom", module).add("default", () => (
  <StoryContainerComponent>
    <SwitchCustom />
  </StoryContainerComponent>
));
