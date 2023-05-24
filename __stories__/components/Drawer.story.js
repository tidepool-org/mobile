/* eslint import/no-extraneous-dependencies: 0 */
import React from "react";

import StoryContainerComponent from "../utils/StoryContainerComponent";
import Drawer from "../../src/components/Drawer";
import { API_ENVIRONMEN_QA2} from "../../src/api";

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
  version: "3.1.1",
  apiEnvironment: API_ENVIRONMENT_QA2,
};

export default {
  title: 'Drawer',
};

export const Default = () => (
  <StoryContainerComponent>
    <Drawer style={{ width: 270, height: 400 }} {...props} />
  </StoryContainerComponent>
);

Default.story = {
  name: 'default',
};

export const LongUserFullName = () => (
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
);

LongUserFullName.story = {
  name: 'long user full name',
};
