import React from "react";
import View from "react-native";
import { storiesOf } from "@storybook/react-native";

import StoryContainerComponent from "../../__stories__/utils/StoryContainerComponent";
import Drawer from "../../src/components/Drawer";

const props = {
  currentUser: {
    username: "email@gmail.com",
    fullName: "Current User",
  },
  navigateDrawerClose: () => {},
  navigateSwitchProfile: () => {},
  navigateSupport: () => {},
  navigatePrivacyAndTerms: () => {},
  authSignOutAsync: () => {},
};

storiesOf("Drawer", module).add("default", () => (
  <StoryContainerComponent>
    <Drawer style={{ width: 270 }} {...props} />
  </StoryContainerComponent>
));
