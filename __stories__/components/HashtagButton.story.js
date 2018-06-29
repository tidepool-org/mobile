/* eslint import/no-extraneous-dependencies: 0 */
import React from "react";
import { storiesOf } from "@storybook/react-native";

import StoryContainerComponent from "../utils/StoryContainerComponent";
import HashtagButton from "../../src/components/HashtagButton";

const onPress = () => {};

storiesOf("HashtagButton", module).add("default", () => (
  <StoryContainerComponent>
    <HashtagButton hashtag="hashtag" onPress={onPress} />
  </StoryContainerComponent>
));
