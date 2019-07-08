/* eslint import/no-extraneous-dependencies: 0 */
import React from "react";
import { storiesOf } from "@storybook/react-native";

import StoryContainerComponent from "../utils/StoryContainerComponent";
import Drawer from "../../src/components/Drawer";
import { API_ENVIRONMENT_STAGING } from "../../src/api";

const props = {
  notesSwitchProfileAndFetchAsync: () => {},
  navigateDrawerClose: () => {},
  navigateSwitchProfile: () => {},
  navigateSupport: () => {},
  navigatePrivacyAndTerms: () => {},
  navigateDebugSettings: () => {},
  authSignOutAsync: () => {},
  currentUser: {
    userId: "1",
    username: "email@gmail.com",
    fullName: "Current User",
  },
  version: "3.0.5",
  apiEnvironment: API_ENVIRONMENT_STAGING,
};

storiesOf("Drawer", module).add("default", () => (
  <StoryContainerComponent>
    <Drawer style={{ width: 270, height: 400 }} {...props} />
  </StoryContainerComponent>
));

storiesOf("Drawer", module).add("long user full name", () => (
  <StoryContainerComponent>
    <Drawer
      style={{ width: 270, height: 400 }}
      {...props}
      currentUser={{
        userId: "1",
        username: "email@gmail.com",
        fullName: "This is a really long full name for a user",
      }}
    />
  </StoryContainerComponent>
));
