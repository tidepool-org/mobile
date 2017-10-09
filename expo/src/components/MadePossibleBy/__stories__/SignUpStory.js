import React from "react";
import { storiesOf } from "@storybook/react-native";

import withThemeProvider from "../../../enhancers/withThemeProvider";
import withExpoFontPreload from "../../../enhancers/withExpoFontPreload";
import PrimaryTheme from "../../../themes/PrimaryTheme";
import MadePossibleBy from "../MadePossibleBy";

const MadePossibleByEnhanced = withThemeProvider(
  withExpoFontPreload(MadePossibleBy, PrimaryTheme.fonts),
  PrimaryTheme,
);

storiesOf("MadePossibleBy", module).add("default", () => (
  <MadePossibleByEnhanced />
));
