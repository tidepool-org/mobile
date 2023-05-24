/* eslint import/no-extraneous-dependencies: 0 */
import React from 'react';

import StoryContainerComponent from '../utils/StoryContainerComponent';
import AddCommentButton from '../../src/components/AddCommentButton';

const onPress = () => {};

export default {
  title: 'AddCommentButton',
};

export const Default = () => (
  <StoryContainerComponent>
    <AddCommentButton onPress={onPress} />
  </StoryContainerComponent>
);

Default.story = {
  name: 'default',
};
