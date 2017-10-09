import React from "react";
import { storiesOf } from "@storybook/react-native";

import withThemeProvider from "../../../enhancers/withThemeProvider";
import withExpoFontPreload from "../../../enhancers/withExpoFontPreload";
import PrimaryTheme from "../../../themes/PrimaryTheme";
import SignUp from "../SignUp";

const SignUpEnhanced = withThemeProvider(
  withExpoFontPreload(SignUp, PrimaryTheme.fonts),
  PrimaryTheme,
);

storiesOf("SignUp", module).add("default", () => <SignUpEnhanced />);
