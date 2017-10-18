import React from "react";
import { storiesOf } from "@storybook/react-native";
import faker from "faker";

import withThemeProvider from "../../../enhancers/withThemeProvider";
import withExpoFontPreload from "../../../enhancers/withExpoFontPreload";
import PrimaryTheme from "../../../themes/PrimaryTheme";
import NoteListItem from "../NoteListItem";

const noteText = faker.fake("{{lorem.paragraph}}");
const NoteListItemEnhanced = withThemeProvider(
  withExpoFontPreload(
    () => <NoteListItem text={noteText} />,
    PrimaryTheme.fonts,
  ),
  PrimaryTheme,
);

storiesOf("NoteListItem", module).add("default", () => (
  <NoteListItemEnhanced />
));
