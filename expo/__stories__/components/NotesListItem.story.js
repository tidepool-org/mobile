/* eslint import/no-extraneous-dependencies: 0 */
import React from "react";
import { storiesOf } from "@storybook/react-native";
import faker from "faker";

import StoryContainerComponent from "../../__stories__/utils/StoryContainerComponent";
import NotesListItem from "../../src/components/NotesListItem";
import formatDate from "../../src/utils/formatDate";

faker.seed(123);

const timestampFormatted = formatDate(faker.date.recent(2));
const messageText = faker.fake("{{lorem.paragraph}}");

storiesOf("NotesListItem", module).add("default", () => (
  <StoryContainerComponent>
    <NotesListItem
      timestampFormatted={timestampFormatted}
      messageText={messageText}
    />
  </StoryContainerComponent>
));
