/* eslint import/no-extraneous-dependencies: 0 */
import React from "react";

import StoryContainerComponent from "../utils/StoryContainerComponent";
import VersionAndApiEnvironment from "../../src/components/VersionAndApiEnvironment";
import {
  API_ENVIRONMENT_QA2,
  API_ENVIRONMENT_PRODUCTION,
} from "../../src/api";

export default {
  title: 'VersionAndApiEnvironment',
};

export const Staging = () => (
  <StoryContainerComponent>
    <VersionAndApiEnvironment
      version="3.1.1"
      apiEnvironment={API_ENVIRONMENT_QA2}
    />
  </StoryContainerComponent>
);

export const Production = () => (
  <StoryContainerComponent>
    <VersionAndApiEnvironment
      version="3.1.1"
      apiEnvironment={API_ENVIRONMENT_PRODUCTION}
    />
  </StoryContainerComponent>
);
