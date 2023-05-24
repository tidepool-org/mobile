/* eslint import/no-extraneous-dependencies: 0 */
import React from 'react';
import glamorous from 'glamorous-native';
import faker from 'faker';

import StoryContainerComponent from '../utils/StoryContainerComponent';
import ProfileList from '../../src/components/ProfileList';

faker.seed(123);

const currentUser = {
  userId: '1',
  username: 'username',
  fullName: 'Current User',
};
const selectedProfileUserId = '3';
const profileListData = [];
for (let i = 1; i <= 10; i += 1) {
  profileListData.push({
    currentUserId: currentUser.userId,
    selectedProfileUserId,
    userId: i.toString(),
    fullName: faker.fake('{{lorem.sentence}}') || faker.name.findName(),
  });
}

const onPress = () => {};
const profilesFetchAsync = () => {};

const props = {
  profileListData,
  onPress,
  profilesFetchAsync,
  user: currentUser,
};

export default {
  title: 'ProfileList',
};

export const Default = () => (
  <StoryContainerComponent>
    <glamorous.View width={270}>
      <ProfileList {...props} />
    </glamorous.View>
  </StoryContainerComponent>
);

Default.story = {
  name: 'default',
};
