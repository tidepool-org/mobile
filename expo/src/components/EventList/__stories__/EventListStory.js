import React from "react";
import { storiesOf } from "@storybook/react-native";
import faker from "faker";

import withThemeProvider from "../../../enhancers/withThemeProvider";
import withExpoFontPreload from "../../../enhancers/withExpoFontPreload";
import PrimaryTheme from "../../../themes/PrimaryTheme";
import EventList from "../EventList";

const data = [];
for (let i = 0; i < 100; i += 1) {
  data.push({
    text: faker.fake("{{lorem.paragraph}}"),
    id: i.toString(),
  });
}

const EventListEnhanced = withThemeProvider(
  withExpoFontPreload(() => <EventList data={data} />, PrimaryTheme.fonts),
  PrimaryTheme,
);

storiesOf("EventList", module).add("default", () => <EventListEnhanced />);
