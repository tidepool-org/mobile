/* eslint import/no-extraneous-dependencies: 0 */
import React from "react";
import { storiesOf } from "@storybook/react-native";
import glamorous from "glamorous-native";

import StoryContainerComponent from "../../__stories__/utils/StoryContainerComponent";
import SearchBar from "../../src/components/SearchBar";

const onChangeText = () => {};

storiesOf("SearchBar", module).add("default", () => (
  <StoryContainerComponent>
    <glamorous.View width={270}>
      <SearchBar placeholderText="Search" onChangeText={onChangeText} />
    </glamorous.View>
  </StoryContainerComponent>
));

storiesOf("SearchBar", module).add("initial text", () => (
  <StoryContainerComponent>
    <glamorous.View width={270}>
      <SearchBar
        searchText="exercise"
        placeholderText="Search"
        onChangeText={onChangeText}
      />
    </glamorous.View>
  </StoryContainerComponent>
));
