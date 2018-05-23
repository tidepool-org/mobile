/* eslint import/no-extraneous-dependencies: 0 */
import React from "react";
import { storiesOf } from "@storybook/react-native";

import StoryContainerComponent from "../../__stories__/utils/StoryContainerComponent";
import AddCommentButton from "../../src/components/AddCommentButton";

const onPress = () => {};

storiesOf("AddCommentButton", module).add("default", () => (
  <StoryContainerComponent>
    <AddCommentButton onPress={onPress} />
  </StoryContainerComponent>
));
