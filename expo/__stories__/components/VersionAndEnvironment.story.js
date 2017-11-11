import React from "react";
import { storiesOf } from "@storybook/react-native";

import { StoryContainerComponent } from "../../__stories__/utils/StoryContainer";
import VersionAndEnvironment from "../../src/components/VersionAndEnvironment";

storiesOf("VersionAndEnvironment", module).add("default", () => (
  <StoryContainerComponent>
    <VersionAndEnvironment version="2.0.1" environment="staging" />
  </StoryContainerComponent>
));
