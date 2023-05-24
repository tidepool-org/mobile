/* eslint import/no-extraneous-dependencies: 0 */
import React from 'react';

import StoryContainerScreen from '../utils/StoryContainerScreen';
import SwitchProfileScreen from '../../src/screens/SwitchProfileScreen';

const props = {
  profileListData: [
    {
      currentUserId: '1',
      selectedProfileUserId: '2',
      userId: '1',
      fullName: 'Current User',
    },
    {
      currentUserId: '1',
      selectedProfileUserId: '2',
      userId: '2',
      fullName: 'Jill Jellyfish',
    },
    {
      currentUserId: '1',
      selectedProfileUserId: '2',
      userId: '3',
      fullName: 'Jill Jellyfish the Second',
    },
  ],
  errorMessage: '',
  fetching: false,
  profilesFetchAsync: () => {},
  notesSwitchProfileAndFetchAsync: () => {},
  currentUser: {
    userId: '1',
    username: 'username',
    fullName: 'Current User',
  },

  navigateGoBack: () => {},
};

export default {
  title: 'SwitchProfileScreen',
};

export const Default = () => (
  <StoryContainerScreen>
    <SwitchProfileScreen {...props} />
  </StoryContainerScreen>
);

Default.story = {
  name: 'default',
};
