/* eslint import/no-extraneous-dependencies: 0 */
import React from "react";
import { storiesOf } from "@storybook/react-native";
import subDays from "date-fns/sub_days";

import StoryContainerScreen from "../../__stories__/utils/StoryContainerScreen";
import HomeScreen from "../../src/screens/HomeScreen";
import formatDate from "../../src/utils/formatDate";

const currentProfileUserId = "";
const notesFetchAsync = () => {};
const notes = [
  {
    id: "1",
    timestampFormatted: formatDate(new Date()),
    messageText: "Note text #testing #sitechange",
  },
  {
    id: "2",
    timestampFormatted: formatDate(subDays(new Date(), 1)),
    messageText: "Note text #testing #sitechange",
  },
  {
    id: "3",
    timestampFormatted: formatDate(subDays(new Date(), 90)),
    messageText: "Note text #testing #sitechange",
  },
  {
    id: "4",
    timestampFormatted: formatDate(subDays(new Date(), 364)),
    messageText: "#meal Note text 4",
  },
  {
    id: "5",
    timestampFormatted: formatDate(subDays(new Date(), 365)),
    messageText: "#meal Note text 5",
  },
  {
    id: "6",
    timestampFormatted: formatDate(subDays(new Date(), 366)),
    messageText: "#exercise #meal Note text 6",
  },
  {
    id: "7",
    timestampFormatted: formatDate(subDays(new Date(), 800)),
    messageText: "#exercise #meal Note text 7",
  },
];

const props = {
  notes,
  notesFetchAsync,
  currentProfileUserId,
};

storiesOf("HomeScreen", module).add("default", () => (
  <StoryContainerScreen>
    <HomeScreen {...props} />
  </StoryContainerScreen>
));
