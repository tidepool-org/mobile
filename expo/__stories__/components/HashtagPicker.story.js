/* eslint import/no-extraneous-dependencies: 0 */
import React from "react";
import { storiesOf } from "@storybook/react-native";

import StoryContainerComponent from "../../__stories__/utils/StoryContainerComponent";
import HashtagPicker from "../../src/components/HashtagPicker";

const onPress = () => {};

const defaultHashtags = [
  "#exercise",
  "#meal",
  "#sitechange",
  "#sensorchange",
  "#juicebox",
  "#devicesetting",
];
const oneHashtag = ["#hashtag1"];
const twoHashTags = ["#hashtag1", "#hashtag2"];
const shortAndLongHashtags = [
  "#h1",
  "#thisisareallylonghashtagseehowlongthishashtagisitjustkeepsgoingonandon",
];
const lotsOfHashtags = [
  "#hashtag1",
  "#hashtag2",
  "#hashtag3",
  "#hashtag4",
  "#hashtag5",
  "#hashtag6",
  "#hashtag7",
  "#hashtag8",
  "#hashtag9",
  "#hashtag10",
  "#hashtag11",
  "#hashtag12",
  "#hashtag13",
  "#hashtag14",
  "#hashtag15",
  "#hashtag16",
  "#hashtag17",
  "#hashtag18",
  "#hashtag19",
  "#hashtag20",
];

storiesOf("HashtagPicker", module).add("default", () => (
  <StoryContainerComponent>
    <HashtagPicker hashtags={defaultHashtags} onPress={onPress} />
  </StoryContainerComponent>
));

storiesOf("HashtagPicker", module).add("one hashtag", () => (
  <StoryContainerComponent>
    <HashtagPicker hashtags={oneHashtag} onPress={onPress} />
  </StoryContainerComponent>
));

storiesOf("HashtagPicker", module).add("two hashtags", () => (
  <StoryContainerComponent>
    <HashtagPicker hashtags={twoHashTags} onPress={onPress} />
  </StoryContainerComponent>
));

storiesOf("HashtagPicker", module).add("short and long hashtags", () => (
  <StoryContainerComponent>
    <HashtagPicker hashtags={shortAndLongHashtags} onPress={onPress} />
  </StoryContainerComponent>
));

storiesOf("HashtagPicker", module).add("lots of hashtags", () => (
  <StoryContainerComponent>
    <HashtagPicker hashtags={lotsOfHashtags} onPress={onPress} />
  </StoryContainerComponent>
));
