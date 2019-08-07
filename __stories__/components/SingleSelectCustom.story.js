import React from "react";
import { storiesOf } from "@storybook/react-native";
import StoryContainerComponent from "../utils/StoryContainerComponent";

import { SingleSelectCustom } from "../../src/components/SingleSelectCustom";

storiesOf("SingleSelectCustom", module).add("default", () => (
  <StoryContainerComponent>
    <SingleSelectCustom 
      placeholder={{
        label: "Select a Story...",
        value: null,
        color: "#9EA0A4",
      }}
    />
  </StoryContainerComponent>
));
