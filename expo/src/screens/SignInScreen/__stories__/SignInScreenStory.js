import React from "react";
import { storiesOf } from "@storybook/react-native";

import withThemeProvider from "../../../enhancers/withThemeProvider";
import withExpoFontPreload from "../../../enhancers/withExpoFontPreload";
import PrimaryTheme from "../../../themes/PrimaryTheme";
import SignInScreen from "../SignInScreen";

const SignInScreenDefaultEnhanced = withThemeProvider(
  withExpoFontPreload(() => <SignInScreen />, PrimaryTheme.fonts),
  PrimaryTheme,
);
storiesOf("SignInScreen", module).add("default", () => (
  <SignInScreenDefaultEnhanced />
));

const SignInScreenLoginErrorEnhanced = withThemeProvider(
  withExpoFontPreload(
    () => <SignInScreen errorMessage="Wrong email or password!" />,
    PrimaryTheme.fonts,
  ),
  PrimaryTheme,
);
storiesOf("SignInScreen", module).add("login error", () => (
  <SignInScreenLoginErrorEnhanced />
));
