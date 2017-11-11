import React from "react";
import { storiesOf } from "@storybook/react-native";

import { StoryContainerComponent } from "../../__stories__/utils/StoryContainer";
import MadePossibleBy from "../../src/components/MadePossibleBy";

storiesOf("MadePossibleBy", module).add("default", () => (
  <StoryContainerComponent>
    <MadePossibleBy />
  </StoryContainerComponent>
));
