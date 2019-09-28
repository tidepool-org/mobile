import React from "react";
import { storiesOf } from "@storybook/react-native";
import StoryContainerComponent from "../utils/StoryContainerComponent";

import { SingleSelectCustom } from "../../src/components/SingleSelectCustom";

storiesOf("SingleSelectCustom", module).add("default", () => (
  <StoryContainerComponent>
    <SingleSelectCustom />
  </StoryContainerComponent>
));
