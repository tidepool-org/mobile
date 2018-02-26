/* eslint import/no-extraneous-dependencies: 0 */
import React from "react";
import glamorous from "glamorous-native";
import { storiesOf } from "@storybook/react-native";
import faker from "faker";
import startOfToday from "date-fns/start_of_today";
import setHours from "date-fns/set_hours";
import setMinutes from "date-fns/set_minutes";
import addMinutes from "date-fns/add_minutes";

import StoryContainerComponent from "../../__stories__/utils/StoryContainerComponent";
import NotesListItem from "../../src/components/NotesListItem";

faker.seed(123);

const currentUser = {
  userId: "1",
  username: "email@gmail.com",
  fullName: "Jill Jellyfish",
};
const currentProfile = {
  userId: "1",
  fullName: "Jill Jellyfish",
};
const timestampEarlierToday = setMinutes(setHours(startOfToday(), 9), 41);
const note = {
  id: "1",
  timestamp: timestampEarlierToday,
  messageText: `#hashtag1 This should not show up in comments. ${faker.fake(
    "{{lorem.paragraph}}"
  )}`,
  userId: "1",
};
const commentsFetchData = {
  comments: [
    {
      id: "5",
      messageText: `This is comment 1 #hashtag1. This is a long comment. ${faker.fake(
        "{{lorem.paragraph}}"
      )}`,
      timestamp: addMinutes(timestampEarlierToday, 60),
      userFullName: "Some other person",
    },
    {
      id: "4",
      messageText: "This is comment 2 #hashtag2",
      timestamp: addMinutes(timestampEarlierToday, 80),
      userFullName: "Some other person",
    },
    {
      id: "3",
      messageText: "This is comment 3 #hashtag3",
      timestamp: addMinutes(timestampEarlierToday, 100),
      userFullName: "Some other person",
    },
    {
      id: "2",
      messageText: "This is comment 4 #hashtag4",
      timestamp: addMinutes(timestampEarlierToday, 120),
      userFullName: "Some other person",
    },
    { ...note, userFullName: "Jill Jellyfish" },
  ],
  fetching: false,
  fetched: true,
};
const commentsFetchAsync = () => {};
const navigateEditNote = () => {};
const navigateAddComment = () => {};
const navigateEditComment = () => {};
const props = {
  currentUser,
  currentProfile,
  note,
  commentsFetchAsync,
  commentsFetchData,
  navigateEditNote,
  navigateAddComment,
  navigateEditComment,
};

storiesOf("NotesListItem", module).add("default", () => (
  <StoryContainerComponent>
    <glamorous.ScrollView>
      <NotesListItem {...props} />
    </glamorous.ScrollView>
  </StoryContainerComponent>
));

storiesOf("NotesListItem", module).add("initially expanded", () => (
  <StoryContainerComponent>
    <glamorous.ScrollView>
      <NotesListItem {...props} initiallyExpanded />
    </glamorous.ScrollView>
  </StoryContainerComponent>
));
