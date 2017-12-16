import React from "react";
import { storiesOf } from "@storybook/react-native";
import faker from "faker";

import StoryContainerComponent from "../../__stories__/utils/StoryContainerComponent";
import EventList from "../../src/components/EventList";

faker.seed(123);

const data = [];
for (let i = 0; i < 100; i += 1) {
  data.push({
    text: faker.fake("{{lorem.paragraph}} #exercise #meal"),
    time: "Nov 7 at 11:12 am",
    id: i.toString(),
  });
}

storiesOf("EventList", module).add("default", () => (
  <StoryContainerComponent>
    <EventList data={data} />
  </StoryContainerComponent>
));
