/* eslint import/no-extraneous-dependencies: 0 */
import React from "react";
import glamorous from "glamorous-native";
import { storiesOf } from "@storybook/react-native";
import faker from "faker";

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
const note = {
  id: "1",
  timestamp: faker.date.recent(2),
  messageText: `#hashtag1 This should not show up in comments. ${faker.fake(
    "{{lorem.paragraph}}"
  )}`,
  userId: "1",
};
const commentsFetchData = {
  comments: [
    {
      id: "5",
      messageText: `This is comment 5 #hashtag5. This is a long comment. ${faker.fake(
        "{{lorem.paragraph}}"
      )}`,
      timestamp: new Date(),
      userFullName: "Some other person",
    },
    {
      id: "4",
      messageText: "This is comment 4 #hashtag4",
      timestamp: new Date(),
      userFullName: "Some other person",
    },
    {
      id: "3",
      messageText: "This is comment 3 #hashtag3",
      timestamp: new Date(),
      userFullName: "Some other person",
    },
    {
      id: "2",
      messageText: "This is comment 2 #hashtag2",
      timestamp: new Date(),
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

storiesOf("NotesListItem", module).add("for add/edit comment screen", () => (
  <StoryContainerComponent>
    <glamorous.ScrollView>
      <NotesListItem
        {...props}
        initiallyExpanded
        allowExpansionToggle={false}
        allowEditing={false}
      />
    </glamorous.ScrollView>
  </StoryContainerComponent>
));
