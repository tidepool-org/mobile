/* eslint import/no-extraneous-dependencies: 0 */
import React from "react";
import { storiesOf } from "@storybook/react-native";
import faker from "faker";

import StoryContainerScreen from "../../__stories__/utils/StoryContainerScreen";
import AddOrEditNoteScreen from "../../src/screens/AddOrEditNoteScreen";

const currentProfile = {
  userId: "1",
  username: "email@gmail.com",
  fullName: "Jill Jellyfish",
};
const note = {
  id: "1",
  timestamp: faker.date.recent(2),
  messageText: `#hashtag1 This should not show up in comments. ${faker.fake(
    "{{lorem.paragraph}}"
  )}`,
};
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
    />
  </StoryContainerScreen>
));
