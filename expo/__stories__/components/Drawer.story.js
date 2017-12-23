/* eslint import/no-extraneous-dependencies: 0 */
import React from "react";
import { storiesOf } from "@storybook/react-native";

import StoryContainerComponent from "../../__stories__/utils/StoryContainerComponent";
import Drawer from "../../src/components/Drawer";
import { API_ENVIRONMENT_STAGING } from "../../src/api";

const props = {
  navigateDrawerClose: () => {},
  navigateSwitchProfile: () => {},
  navigateSupport: () => {},
  navigatePrivacyAndTerms: () => {},
  navigateDebugSettings: () => {},
  authSignOutAsync: () => {},
  currentUser: {
    username: "email@gmail.com",
    fullName: "Current User",
  },
  version: "3.0.0",
  apiEnvironment: API_ENVIRONMENT_STAGING,
};

storiesOf("Drawer", module).add("default", () => (
  <StoryContainerComponent>
    <Drawer style={{ width: 270 }} {...props} />
  </StoryContainerComponent>
));
