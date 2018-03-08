/* eslint import/no-extraneous-dependencies: 0 */
import React from "react";
import { storiesOf } from "@storybook/react-native";
import faker from "faker";

import StoryContainerScreen from "../../__stories__/utils/StoryContainerScreen";
import AddOrEditNoteScreen from "../../src/screens/AddOrEditNoteScreen";
import HashtagCollection from "../../src/utils/HashtagCollection";

faker.seed(123);

const currentProfile = {
  userId: "1",
  username: "email@gmail.com",
  fullName: "Jill Jellyfish",
};
const timestampAddNote = new Date("01/01/2018 9:41 AM");
const note = {
  id: "1",
  timestamp: new Date("01/01/2018 9:41 AM"),
  messageText: `#hashtag1 This should not show up in comments. ${faker.fake(
    "{{lorem.paragraph}}"
  )}`,
};
const hashtagCollection = new HashtagCollection();
const hashtags = hashtagCollection.hashtagsSortedByCount;
const navigateGoBack = () => {};
const noteUpdateAsync = () => {};
const noteAddAsync = () => {};

storiesOf("AddOrEditNoteScreen", module).add("Add", () => (
  <StoryContainerScreen>
    <AddOrEditNoteScreen
      navigateGoBack={navigateGoBack}
      noteUpdateAsync={noteUpdateAsync}
      noteAddAsync={noteAddAsync}
      currentUser={currentProfile}
      currentProfile={currentProfile}
      timestampAddNote={timestampAddNote}
      hashtags={hashtags}
    />
  </StoryContainerScreen>
));

storiesOf("AddOrEditNoteScreen", module).add("Edit", () => (
  <StoryContainerScreen>
    <AddOrEditNoteScreen
      navigateGoBack={navigateGoBack}
      noteUpdateAsync={noteUpdateAsync}
      noteAddAsync={noteAddAsync}
      currentUser={currentProfile}
      currentProfile={currentProfile}
      note={note}
      hashtags={hashtags}
    />
  </StoryContainerScreen>
));
