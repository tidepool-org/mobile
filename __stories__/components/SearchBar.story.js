/* eslint import/no-extraneous-dependencies: 0 */
import React from "react";
import glamorous from "glamorous-native";

import StoryContainerComponent from "../utils/StoryContainerComponent";
import SearchBar from "../../src/components/SearchBar";

const onChangeText = () => {};

export default {
  title: 'SearchBar',
};

export const Default = () => (
  <StoryContainerComponent>
    <glamorous.View width={270}>
      <SearchBar placeholderText="Search" onChangeText={onChangeText} />
    </glamorous.View>
  </StoryContainerComponent>
);

Default.story = {
  name: 'default',
};

export const InitialText = () => (
  <StoryContainerComponent>
    <glamorous.View width={270}>
      <SearchBar
        searchText="exercise"
        placeholderText="Search"
        onChangeText={onChangeText}
      />
    </glamorous.View>
  </StoryContainerComponent>
);

InitialText.story = {
  name: 'initial text',
};
