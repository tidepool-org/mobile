import React from "react";
import View from "react-native";
import { storiesOf } from "@storybook/react-native";

import StoryContainerComponent from "../../__stories__/utils/StoryContainerComponent";
import Drawer from "../../src/components/Drawer";
import { ENVIRONMENT_STAGING } from "../../src/api";

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
  environment: ENVIRONMENT_STAGING,
};

storiesOf("Drawer", module).add("default", () => (
  <StoryContainerComponent>
    <Drawer style={{ width: 270 }} {...props} />
  </StoryContainerComponent>
));
