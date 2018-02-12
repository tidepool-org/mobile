/* eslint import/no-extraneous-dependencies: 0 */
import React from "react";
import { storiesOf } from "@storybook/react-native";
import faker from "faker";

import StoryContainerComponent from "../../__stories__/utils/StoryContainerComponent";
import NotesList from "../../src/components/NotesList";

faker.seed(123);

const notesFetchAsync = () => {};
const commentsFetchAsync = () => {};
const navigateEditNote = () => {};
const navigateAddComment = () => {};
const navigateEditComment = () => {};
const notes = [];
for (let i = 0; i < 100; i += 1) {
  if (i < 2) {
    notes.push({
      id: i.toString(),
      timestamp: faker.date.recent(i * 2),
      messageText: faker.fake("{{lorem.paragraph}} #exercise #meal"),
      userId: "1",
    });
  } else {
    notes.push({
      id: i.toString(),
      timestamp: faker.date.recent(i * 275),
      messageText: faker.fake("{{lorem.paragraph}} #exercise #meal"),
      userId: "1",
    });
  }
}
const currentUser = {
  userId: "1",
  username: "email@gmail.com",
  fullName: "Jill Jellyfish",
};

const props = {
  currentUser,
  currentProfile: currentUser,
  notes,
  notesFetchAsync,
  commentsFetchAsync,
  navigateEditNote,
  navigateAddComment,
  navigateEditComment,
};

storiesOf("NotesList", module).add("default", () => (
  <StoryContainerComponent>
    <NotesList {...props} />
  </StoryContainerComponent>
));
