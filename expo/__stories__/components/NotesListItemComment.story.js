/* eslint import/no-extraneous-dependencies: 0 */
import React from "react";
import { storiesOf } from "@storybook/react-native";
import faker from "faker";

import StoryContainerComponent from "../../__stories__/utils/StoryContainerComponent";
import NotesListItemComment from "../../src/components/NotesListItemComment";

faker.seed(123);

const comment = {
  id: "1",
  timestamp: faker.date.recent(2),
  messageText: faker.fake("#hashtag1 {{lorem.paragraph}} #hashtag2"),
  userFullName: "Jell Jellyfish",
};

storiesOf("NotesListItemComment", module).add("default", () => (
  <StoryContainerComponent>
    <NotesListItemComment comment={comment} />
  </StoryContainerComponent>
));

const commentWithLongUserFullName = {
  id: "1",
  timestamp: faker.date.recent(2),
  messageText: faker.fake("#hashtag1 {{lorem.paragraph}} #hashtag2"),
  userFullName: "This is a really long full name for a user",
};

storiesOf("NotesListItemComment", module).add("long user full name", () => (
  <StoryContainerComponent>
    <NotesListItemComment
      style={{ width: 300 }}
      comment={commentWithLongUserFullName}
    />
  </StoryContainerComponent>
));
