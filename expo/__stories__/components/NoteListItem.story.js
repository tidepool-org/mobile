import React from "react";
import { storiesOf } from "@storybook/react-native";
import faker from "faker";

import StoryContainerComponent from "../../__stories__/utils/StoryContainerComponent";
import NoteListItem from "../../src/components/NoteListItem";

faker.seed(123);

const time = "Nov 7 at 11:12 am";
const text = faker.fake("{{lorem.paragraph}}");

storiesOf("NoteListItem", module).add("default", () => (
  <StoryContainerComponent>
    <NoteListItem time={time} text={text} />
  </StoryContainerComponent>
));
