import React from "react";
import View from "react-native";
import { storiesOf } from "@storybook/react-native";

import { StoryContainerComponent } from "../../__stories__/utils/StoryContainer";
import Drawer from "../../src/components/Drawer";

const navigation = {
  navigate: () => {},
  dispatch: () => {},
  goBack: () => {},
};

const currentUser = {
  username: "email@gmail.com", // TODO: redux
};

storiesOf("Drawer", module).add("default", () => (
  <StoryContainerComponent>
    <Drawer
      style={{ width: 270 }}
      currentUser={currentUser}
      navigation={navigation}
    />
  </StoryContainerComponent>
));
