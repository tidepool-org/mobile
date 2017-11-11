import React from "react";
import { storiesOf } from "@storybook/react-native";
import faker from "faker";

import { StoryContainerComponent } from "../../__stories__/utils/StoryContainer";
import EventList from "../../src/components/EventList";

const data = [];
for (let i = 0; i < 100; i += 1) {
  data.push({
    text: faker.fake("{{lorem.paragraph}}"),
    id: i.toString(),
  });
}

storiesOf("EventList", module).add("default", () => (
  <StoryContainerComponent>
    <EventList data={data} />
  </StoryContainerComponent>
));
