/* eslint import/no-extraneous-dependencies: 0 */
import React from "react";
import { storiesOf } from "@storybook/react-native";
import glamorous from "glamorous-native";
import faker from "faker";

import StoryContainerComponent from "../../__stories__/utils/StoryContainerComponent";
import ProfileList from "../../src/components/ProfileList";

faker.seed(123);

const currentUserId = "1";
const selectedProfileUserId = "3";
const profiles = [];
for (let i = 1; i <= 10; i += 1) {
  profiles.push({
    userid: i.toString(),
    fullname: faker.fake("{{lorem.sentence}}") || faker.name.findName(),
  });
}
const items = profiles.map(profile => ({
  currentUserId,
  selectedProfileUserId,
  profile,
}));

const onPress = () => {};

storiesOf("ProfileList", module).add("default", () => (
  <StoryContainerComponent>
    <glamorous.View width={270}>
      <ProfileList items={items} onPress={onPress} />
    </glamorous.View>
  </StoryContainerComponent>
));
