import React from "react";
import { storiesOf } from "@storybook/react-native";

import withThemeProvider from "../../../enhancers/withThemeProvider";
import withExpoFontPreload from "../../../enhancers/withExpoFontPreload";
import PrimaryTheme from "../../../themes/PrimaryTheme";
import VersionAndEnvironment from "../VersionAndEnvironment";

const VersionAndEnvironmentEnhanced = withThemeProvider(
  withExpoFontPreload(VersionAndEnvironment, PrimaryTheme.fonts),
  PrimaryTheme,
);

storiesOf("VersionAndEnvironment", module).add("default", () => (
  <VersionAndEnvironmentEnhanced version="2.0.1" environment="staging" />
));
