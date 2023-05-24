/* eslint import/no-extraneous-dependencies: 0 */
import React from 'react';

import StoryContainerComponent from '../utils/StoryContainerComponent';
import HashtagButton from '../../src/components/HashtagButton';

const onPress = () => {};

export default {
  title: 'HashtagButton',
};

export const Default = () => (
  <StoryContainerComponent>
    <HashtagButton hashtag="hashtag" onPress={onPress} />
  </StoryContainerComponent>
);

Default.story = {
  name: 'default',
};
