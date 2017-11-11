import React from "react";
import { storiesOf } from "@storybook/react-native";

import { StoryContainerComponent } from "../../__stories__/utils/StoryContainer";
import Button from "../../src/components/Button";

storiesOf("Button", module).add("default", () => (
  <StoryContainerComponent>
    <Button title="Log in" onPress={() => {}} />
  </StoryContainerComponent>
));
