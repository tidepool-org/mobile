/* eslint import/no-extraneous-dependencies: 0 */
import React from "react";
import { storiesOf } from "@storybook/react-native";
import subDays from "date-fns/sub_days";
import faker from "faker";

import StoryContainerScreen from "../utils/StoryContainerScreen";
import HomeScreen from "../../src/screens/HomeScreen";
import {
  DEFAULT_LOW_BG_BOUNDARY_VALUE,
  DEFAULT_HIGH_BG_BOUNDARY_VALUE,
  GRAPH_RENDERER_THREE_JS,
} from "../../src/components/Graph/helpers";
import NotesFetchData from "../../src/models/NotesFetchData";

faker.seed(123);

const navigation = {};
const graphRenderer = GRAPH_RENDERER_THREE_JS;
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
const notesFetchAsync = () => {};
const notesFetchSetSearchFilter = () => {};
const commentsFetchAsync = () => {};
const graphDataFetchAsync = () => {};
const navigateEditNote = () => {};
const navigateAddComment = () => {};
const navigateEditComment = () => {};
const noteDeleteAsync = () => {};
const commentDeleteAsync = () => {};
const firstTimeTipsShowTip = () => {};

const notes = [];
for (let i = 0; i < 100; i += 1) {
  notes.push({
    id: i.toString(),
    timestamp: subDays(new Date("01/17/2018 9:41 AM"), i),
    messageText: faker.fake("{{lorem.paragraph}} #exercise #meal"),
    userId: "1",
  });
}
const notesFetch = new NotesFetchData();
notesFetch.didStart({ userId: currentProfile.userId });
notesFetch.didSucceed({ notes, profile: currentProfile });

const props = {
  currentUser,
  notesFetch,
  notesFetchAsync,
  notesFetchSetSearchFilter,
  currentProfile,
  commentsFetchAsync,
  graphDataFetchAsync,
  graphRenderer,
  navigateEditNote,
  navigateAddComment,
  navigateEditComment,
  noteDeleteAsync,
  commentDeleteAsync,
  firstTimeTipsShowTip,
  navigation,
};

storiesOf("HomeScreen", module).add("default", () => (
  <StoryContainerScreen>
    <HomeScreen {...props} />
  </StoryContainerScreen>
));
