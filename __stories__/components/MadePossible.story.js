/* eslint import/no-extraneous-dependencies: 0 */
import React from 'react';

import StoryContainerComponent from '../utils/StoryContainerComponent';
import MadePossibleBy from '../../src/components/MadePossibleBy';

export default {
  title: 'MadePossibleBy',
};

export const Default = () => (
  <StoryContainerComponent>
    <MadePossibleBy />
  </StoryContainerComponent>
);

Default.story = {
  name: 'default',
};
