/* eslint import/no-extraneous-dependencies: 0 */
import React from "react";
import { storiesOf } from "@storybook/react-native";

import StoryContainerComponent from "../utils/StoryContainerComponent";
import VersionAndApiEnvironment from "../../src/components/VersionAndApiEnvironment";
import {
  API_ENVIRONMENT_QA2,
  API_ENVIRONMENT_PRODUCTION,
} from "../../src/api";

storiesOf("VersionAndApiEnvironment", module).add("Staging", () => (
  <StoryContainerComponent>
    <VersionAndApiEnvironment
      version="3.1.1"
      apiEnvironment={API_ENVIRONMENT_QA2}
    />
  </StoryContainerComponent>
));

storiesOf("VersionAndApiEnvironment", module).add("Production", () => (
  <StoryContainerComponent>
    <VersionAndApiEnvironment
      version="3.1.1"
      apiEnvironment={API_ENVIRONMENT_PRODUCTION}
    />
  </StoryContainerComponent>
));
