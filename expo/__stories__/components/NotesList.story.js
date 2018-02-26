/* eslint import/no-extraneous-dependencies: 0 */
import React from "react";
import { storiesOf } from "@storybook/react-native";
import faker from "faker";
import startOfToday from "date-fns/start_of_today";
import setHours from "date-fns/set_hours";
import setMinutes from "date-fns/set_minutes";
import subDays from "date-fns/sub_days";

import StoryContainerComponent from "../../__stories__/utils/StoryContainerComponent";
import NotesList from "../../src/components/NotesList";

faker.seed(123);

const notesFetchAsync = () => {};
const commentsFetchAsync = () => {};
const navigateEditNote = () => {};
const navigateAddComment = () => {};
const navigateEditComment = () => {};
const notes = [];
const timestampEarlierToday = setMinutes(setHours(startOfToday(), 9), 41);
for (let i = 0; i < 100; i += 1) {
  let timestamp;
  if (i < 2) {
    // Test relative date format ("Today", "Yesterday")
    timestamp = subDays(timestampEarlierToday, i);
  } else {
    timestamp = subDays(new Date("01/17/2018 9:41 AM"), i);
  }
  notes.push({
    id: i.toString(),
    timestamp,
    messageText: faker.fake("{{lorem.paragraph}} #exercise #meal"),
    userId: "1",
  });
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
