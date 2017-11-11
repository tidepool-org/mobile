import React from "react";
import { storiesOf } from "@storybook/react-native";
import faker from "faker";

import { StoryContainerComponent } from "../../__stories__/utils/StoryContainer";
import NoteListItem from "../../src/components/NoteListItem";

const noteText = faker.fake("{{lorem.paragraph}}");

storiesOf("NoteListItem", module).add("default", () => (
  <StoryContainerComponent>
    <NoteListItem text={noteText} />
  </StoryContainerComponent>
));
