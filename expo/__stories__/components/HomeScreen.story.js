/* eslint import/no-extraneous-dependencies: 0 */
import React from "react";
import { storiesOf } from "@storybook/react-native";
import startOfToday from "date-fns/start_of_today";
import setHours from "date-fns/set_hours";
import setMinutes from "date-fns/set_minutes";
import subDays from "date-fns/sub_days";
import faker from "faker";

import StoryContainerScreen from "../../__stories__/utils/StoryContainerScreen";
import HomeScreen from "../../src/screens/HomeScreen";

faker.seed(123);

const currentUser = {
  userId: "1",
  username: "email@gmail.com",
  fullName: "Jill Jellyfish",
};
const timestampEarlierToday = setMinutes(setHours(startOfToday(), 9), 41);
const currentProfile = {
  userId: "1",
  fullName: "Jill Jellyfish",
};
const notesFetchAsync = () => {};
const commentsFetchAsync = () => {};
const navigateEditNote = () => {};
const navigateAddComment = () => {};
const navigateEditComment = () => {};
const notes = [];
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

const props = {
  currentUser,
  notes,
  notesFetchAsync,
  currentProfile,
  commentsFetchAsync,
  navigateEditNote,
  navigateAddComment,
  navigateEditComment,
};

storiesOf("HomeScreen", module).add("default", () => (
  <StoryContainerScreen>
    <HomeScreen {...props} />
  </StoryContainerScreen>
));
