import React from "react";
import { storiesOf } from "@storybook/react-native";

// import { Switch } from "react-native-switch";


import { Switch } from "react-native";


import StoryContainerComponent from "../utils/StoryContainerComponent";

storiesOf("SwitchCustom", module).add("default", () => (
  <StoryContainerComponent>
    <Switch 
      trackColor={{true: "#627cff"}}
    />
  </StoryContainerComponent>
));
