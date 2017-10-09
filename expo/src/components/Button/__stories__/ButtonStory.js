import React from "react";
import { storiesOf } from "@storybook/react-native";

import withThemeProvider from "../../../enhancers/withThemeProvider";
import withExpoFontPreload from "../../../enhancers/withExpoFontPreload";
import PrimaryTheme from "../../../themes/PrimaryTheme";
import Button from "../Button";

const ButtonEnhanced = withThemeProvider(
  withExpoFontPreload(Button, PrimaryTheme.fonts),
  PrimaryTheme,
);

storiesOf("Button", module).add("default", () => (
  <ButtonEnhanced title="Log in" onPress={() => {}} />
));
