/* eslint import/no-extraneous-dependencies: 0 */
import React from 'react';
import faker from 'faker';

import StoryContainerScreen from '../utils/StoryContainerScreen';
import AddOrEditNoteScreen from '../../src/screens/AddOrEditNoteScreen';
import HashtagCollection from '../../src/models/HashtagCollection';
import {
  DEFAULT_LOW_BG_BOUNDARY_VALUE,
  DEFAULT_HIGH_BG_BOUNDARY_VALUE,
} from '../../src/components/Graph/helpers';

faker.seed(123);

const currentProfile = {
  userId: '1',
  username: 'email@gmail.com',
  fullName: 'Jill Jellyfish',
  lowBGBoundary: DEFAULT_LOW_BG_BOUNDARY_VALUE,
  highBGBoundary: DEFAULT_HIGH_BG_BOUNDARY_VALUE,
};
const timestampAddNote = new Date('Mon Jul 27 2015 22:29:00 GMT-0500 (CDT)');
const note = {
  id: '1',
  timestamp: new Date('Mon Jul 27 2015 22:29:00 GMT-0500 (CDT)'),
  messageText: `#hashtag1 This should not show up in comments. ${faker.fake(
    '{{lorem.paragraph}}'
  )}`,
};
const hashtagCollection = new HashtagCollection();
const hashtags = hashtagCollection.hashtagsSortedByCount;
const navigateGoBack = () => {};
const noteUpdateAsync = () => {};
const noteAddAsync = () => {};

// TODO: stories - There are keyboard issues with on device UI for storybook
// with this screen. The timer that shows the keyboard after screen is shown
// doesn't play nicely with the component rendering and navigator for storybook.
// Temporarily disabling these for now. They could be re-enabled (and the
// focusTimer disabled) for targeted testing of this screen.

// storiesOf("AddOrEditNoteScreen", module).add("Add", () => (
//   <StoryContainerScreen>
//     <AddOrEditNoteScreen
//       navigateGoBack={navigateGoBack}
//       noteUpdateAsync={noteUpdateAsync}
//       noteAddAsync={noteAddAsync}
//       currentUser={currentProfile}
//       currentProfile={currentProfile}
//       timestampAddNote={timestampAddNote}
//       hashtags={hashtags}
//     />
//   </StoryContainerScreen>
// ));

// storiesOf("AddOrEditNoteScreen", module).add("Edit", () => (
//   <StoryContainerScreen>
//     <AddOrEditNoteScreen
//       navigateGoBack={navigateGoBack}
//       noteUpdateAsync={noteUpdateAsync}
//       noteAddAsync={noteAddAsync}
//       currentUser={currentProfile}
//       currentProfile={currentProfile}
//       note={note}
//       hashtags={hashtags}
//     />
//   </StoryContainerScreen>
// ));
