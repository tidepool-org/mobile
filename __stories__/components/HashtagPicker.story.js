/* eslint import/no-extraneous-dependencies: 0 */
import React from "react";
import glamorous from "glamorous-native";

import StoryContainerComponent from "../utils/StoryContainerComponent";
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

export default {
  title: 'HashtagPicker',
};

export const Default = () => (
  <StoryContainerComponent>
    <glamorous.View height={64}>
      <HashtagPicker hashtags={defaultHashtags} onPress={onPress} />
    </glamorous.View>
  </StoryContainerComponent>
);

Default.story = {
  name: 'default',
};

export const OneHashtag = () => (
  <StoryContainerComponent>
    <glamorous.View height={64}>
      <HashtagPicker hashtags={oneHashtag} onPress={onPress} />
    </glamorous.View>
  </StoryContainerComponent>
);

OneHashtag.story = {
  name: 'one hashtag',
};

export const TwoHashtags = () => (
  <StoryContainerComponent>
    <glamorous.View height={64}>
      <HashtagPicker hashtags={twoHashTags} onPress={onPress} />
    </glamorous.View>
  </StoryContainerComponent>
);

TwoHashtags.story = {
  name: 'two hashtags',
};

export const ShortAndLongHashtags = () => (
  <StoryContainerComponent>
    <glamorous.View height={64}>
      <HashtagPicker hashtags={shortAndLongHashtags} onPress={onPress} />
    </glamorous.View>
  </StoryContainerComponent>
);

ShortAndLongHashtags.story = {
  name: 'short and long hashtags',
};

export const LotsOfHashtags = () => (
  <StoryContainerComponent>
    <glamorous.View height={64}>
      <HashtagPicker hashtags={lotsOfHashtags} onPress={onPress} />
    </glamorous.View>
  </StoryContainerComponent>
);

LotsOfHashtags.story = {
  name: 'lots of hashtags',
};
