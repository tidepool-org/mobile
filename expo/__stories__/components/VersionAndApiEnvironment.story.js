import React from "react";
import { storiesOf } from "@storybook/react-native";

import StoryContainerComponent from "../../__stories__/utils/StoryContainerComponent";
import VersionAndApiEnvironment from "../../src/components/VersionAndApiEnvironment";
import { API_ENVIRONMENT_STAGING, API_ENVIRONMENT_PRODUCTION } from "../../src/api";

storiesOf("VersionAndApiEnvironment", module).add("Staging", () => (
  <StoryContainerComponent>
    <VersionAndApiEnvironment version="3.0.0" apiEnvironment={API_ENVIRONMENT_STAGING} />
  </StoryContainerComponent>
));

storiesOf("VersionAndApiEnvironment", module).add("Production", () => (
  <StoryContainerComponent>
    <VersionAndApiEnvironment
      version="3.0.0"
      apiEnvironment={API_ENVIRONMENT_PRODUCTION}
    />
  </StoryContainerComponent>
));
