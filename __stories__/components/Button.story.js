/* eslint import/no-extraneous-dependencies: 0 */
import React from 'react';

import StoryContainerComponent from '../utils/StoryContainerComponent';
import Button from '../../src/components/Button';

export default {
  title: 'Button',
};

export const Default = () => (
  <StoryContainerComponent>
    <Button title="Log in" onPress={() => {}} />
  </StoryContainerComponent>
);

Default.story = {
  name: 'default',
};
