/* eslint import/no-extraneous-dependencies: 0 */
import React from "react";
import { storiesOf } from "@storybook/react-native";

import StoryContainerComponent from "../utils/StoryContainerComponent";
import { ButtonWithHeaderAndLongText } from "../../src/components/ButtonWithHeaderAndLongText";

storiesOf("ButtonWithHeaderAndLongText", module).add("default", () => (
  <StoryContainerComponent>
    <ButtonWithHeaderAndLongText
      title="Personal Account"
      onPress={() => {}}
      bodyText="You want to manage your diabetes data. You are caring for or supporting someone with diabetes."
    />
  </StoryContainerComponent>
));
