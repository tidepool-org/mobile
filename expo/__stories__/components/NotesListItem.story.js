/* eslint import/no-extraneous-dependencies: 0 */
import React from "react";
import { storiesOf } from "@storybook/react-native";
import faker from "faker";

import StoryContainerComponent from "../../__stories__/utils/StoryContainerComponent";
import NotesListItem from "../../src/components/NotesListItem";

faker.seed(123);

const timestamp = faker.date.recent(2);
const messageText = faker.fake("{{lorem.paragraph}}");

storiesOf("NotesListItem", module).add("default", () => (
  <StoryContainerComponent>
    <NotesListItem timestamp={timestamp} messageText={messageText} />
  </StoryContainerComponent>
));
