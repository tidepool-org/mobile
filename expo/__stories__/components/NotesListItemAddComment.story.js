/* eslint import/no-extraneous-dependencies: 0 */
import React from "react";
import { storiesOf } from "@storybook/react-native";

import StoryContainerComponent from "../../__stories__/utils/StoryContainerComponent";
import NotesListItemAddComment from "../../src/components/NotesListItemAddComment";

const onPress = () => {};

storiesOf("NotesListItemAddComment", module).add("default", () => (
  <StoryContainerComponent>
    <NotesListItemAddComment onPress={onPress} />
  </StoryContainerComponent>
));
