import React from "react";
import { storiesOf } from "@storybook/react-native";

import StoryContainerComponent from "../utils/StoryContainerComponent";
import { ButtonWithLongText } from "../../src/components/ButtonWithLongText";

storiesOf("ButtonWithLongText", module).add("default", () => (
  <StoryContainerComponent>
    <ButtonWithLongText
      title="This is for me, I have diabetes"
      onPress={() => {}}
    />
  </StoryContainerComponent>
));
