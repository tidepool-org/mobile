import React from "react";
import { storiesOf } from "@storybook/react-native";

import StoryContainerScreen from "../../__stories__/utils/StoryContainerScreen";
import HomeScreen from "../../src/screens/HomeScreen";

const eventListData = [
  {
    id: "1",
    time: "December 2, 7:00 pm",
    text: "Note text #testing #sitechange",
  },
  {
    id: "2",
    time: "October 26, 2:00 pm",
    text: "#meal Note text 2",
  },
  {
    id: "3",
    time: "July 10, 12:00 pm",
    text: "#exercise #meal Note text 3",
  },
];

storiesOf("HomeScreen", module).add("default", () => (
  <StoryContainerScreen>
    <HomeScreen eventListData={eventListData} />
  </StoryContainerScreen>
));
