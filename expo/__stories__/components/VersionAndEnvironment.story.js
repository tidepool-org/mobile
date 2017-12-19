import React from "react";
import { storiesOf } from "@storybook/react-native";

import StoryContainerComponent from "../../__stories__/utils/StoryContainerComponent";
import VersionAndEnvironment from "../../src/components/VersionAndEnvironment";
import { ENVIRONMENT_STAGING, ENVIRONMENT_PRODUCTION } from "../../src/api";

storiesOf("VersionAndEnvironment", module).add("Staging", () => (
  <StoryContainerComponent>
    <VersionAndEnvironment version="3.0.0" environment={ENVIRONMENT_STAGING} />
  </StoryContainerComponent>
));

storiesOf("VersionAndEnvironment", module).add("Production", () => (
  <StoryContainerComponent>
    <VersionAndEnvironment
      version="3.0.0"
      environment={ENVIRONMENT_PRODUCTION}
    />
  </StoryContainerComponent>
));
