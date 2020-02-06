/* eslint import/no-extraneous-dependencies: 0 */
import React from "react";
import { storiesOf } from "@storybook/react-native";

import StoryContainerScreen from "../utils/StoryContainerScreen";
import DebugHealthScreen from "../../src/screens/DebugHealthScreen";

const props = {
  errorMessage: "",
  currentUser: {
    userId: "1",
    username: "email@gmail.com",
    fullName: "Current User",
  },
  health: {
    shouldShowHealthKitUI: true,
    isHealthKitAuthorized: false,
    isHealthKitInterfaceEnabledForCurrentUser: false,
    isHealthKitInterfaceConfiguredForOtherUser: false,
  },
  navigateGoBack: () => {},
};

// TODO: stories - There are modal issues with the way this is shown. Can't
// dismiss it and it covers up the navigator stuff. Disable for now. Will
// address this as separate fix later. For now, can still re-enable this
// temporarily for targeted testing of the DebugSettings screen as needed.

// storiesOf("DebugHealthScreen", module).add("default", () => (
//   <StoryContainerScreen>
//     <DebugHealthScreen {...props} />
//   </StoryContainerScreen>
// ));
