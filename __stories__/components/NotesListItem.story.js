/* eslint import/no-extraneous-dependencies: 0 */
import React from "react";
import glamorous from "glamorous-native";
import { storiesOf } from "@storybook/react-native";
import faker from "faker";
import startOfToday from "date-fns/start_of_today";
import startOfYesterday from "date-fns/start_of_yesterday";
import setHours from "date-fns/set_hours";
import setMinutes from "date-fns/set_minutes";
import addMinutes from "date-fns/add_minutes";

import StoryContainerComponent from "../utils/StoryContainerComponent";
import NotesListItem from "../../src/components/NotesListItem";
import {
  DEFAULT_LOW_BG_BOUNDARY_VALUE,
  DEFAULT_HIGH_BG_BOUNDARY_VALUE,
  GRAPH_RENDERER_THREE_JS,
} from "../../src/components/Graph/helpers";

faker.seed(123);

const currentUser = {
  userId: "1",
  username: "email@gmail.com",
  fullName: "Jill Jellyfish",
};
const currentProfile = {
  userId: "1",
  fullName: "Jill Jellyfish",
  lowBGBoundary: DEFAULT_LOW_BG_BOUNDARY_VALUE,
  highBGBoundary: DEFAULT_HIGH_BG_BOUNDARY_VALUE,
};
const timestamp = new Date("Mon Jul 27 2015 22:29:00 GMT-0500 (CDT)");
const timestampEarlyToday = setMinutes(setHours(startOfToday(), 9), 41);
const timestampEarlyYesterday = setMinutes(setHours(startOfYesterday(), 9), 41);
const note = {
  id: "1",
  timestamp,
  messageText: `#hashtag1 This should not show up in comments. ${faker.fake(
    "{{lorem.paragraph}}"
  )}`,
  userId: "1",
  groupId: "groupId",
  userFullName: "Jill Jellyfish",
};
const noteToday = {
  id: "1",
  timestamp: timestampEarlyToday,
  messageText: `#hashtag1 This should not show up in comments. ${faker.fake(
    "{{lorem.paragraph}}"
  )}`,
  userId: "1",
  groupId: "groupId",
  userFullName: "Jill Jellyfish",
};
const noteYesterday = {
  id: "1",
  timestamp: timestampEarlyYesterday,
  messageText: `#hashtag1 This should not show up in comments. ${faker.fake(
    "{{lorem.paragraph}}"
  )}`,
  userId: "1",
  groupId: "groupId",
  userFullName: "Jill Jellyfish",
};
const graphDataFetchData = {
  graphData: {},
  fetching: false,
  fetched: true,
};
const graphDataFetchAsync = () => {};
const commentsFetchData = {
  comments: [
    {
      id: "5",
      messageText: `This is comment 1 #hashtag1. This is a long comment. ${faker.fake(
        "{{lorem.paragraph}}"
      )}`,
      timestamp: addMinutes(timestampEarlyToday, 60),
      userFullName: "Some other person",
    },
    {
      id: "4",
      messageText: "This is comment 2 #hashtag2",
      timestamp: addMinutes(timestampEarlyToday, 80),
      userFullName: "Some other person",
    },
    {
      id: "3",
      messageText: "This is comment 3 #hashtag3",
      timestamp: addMinutes(timestampEarlyToday, 100),
      userFullName: "Some other person",
    },
    {
      id: "2",
      messageText: "This is comment 4 #hashtag4",
      timestamp: addMinutes(timestampEarlyToday, 120),
      userFullName: "Some other person",
    },
    { ...note, userFullName: "Jill Jellyfish" },
  ],
  fetching: false,
  fetched: true,
};
const commentsFetchAsync = () => {};
const navigateEditNote = () => {};
const onDeleteNotePressed = () => {};
const navigateAddComment = () => {};
const navigateEditComment = () => {};
const onDeleteCommentPressed = () => {};
const onGraphZoomStart = () => {};
const onGraphZoomEnd = () => {};
const graphRenderer = GRAPH_RENDERER_THREE_JS;
const props = {
  currentUser,
  currentProfile,
  commentsFetchAsync,
  commentsFetchData,
  graphDataFetchAsync,
  graphDataFetchData,
  navigateEditNote,
  onDeleteNotePressed,
  navigateAddComment,
  navigateEditComment,
  onDeleteCommentPressed,
  onGraphZoomStart,
  onGraphZoomEnd,
  graphRenderer,
};

storiesOf("NotesListItem", module).add("default", () => (
  <StoryContainerComponent>
    <glamorous.ScrollView>
      <NotesListItem {...props} note={note} />
    </glamorous.ScrollView>
  </StoryContainerComponent>
));

storiesOf("NotesListItem", module).add("initially expanded", () => {
  const noteInitiallyExpanded = { ...note, initiallyExpanded: true };
  return (
    <StoryContainerComponent>
      <glamorous.ScrollView>
        <NotesListItem {...props} note={noteInitiallyExpanded} />
      </glamorous.ScrollView>
    </StoryContainerComponent>
  );
});

storiesOf("NotesListItem", module).add("today", () => (
  <StoryContainerComponent>
    <glamorous.ScrollView>
      <NotesListItem {...props} note={noteToday} />
    </glamorous.ScrollView>
  </StoryContainerComponent>
));

storiesOf("NotesListItem", module).add("yesterday", () => (
  <StoryContainerComponent>
    <glamorous.ScrollView>
      <NotesListItem {...props} note={noteYesterday} />
    </glamorous.ScrollView>
  </StoryContainerComponent>
));
