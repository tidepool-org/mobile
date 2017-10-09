import React from "react";
import { storiesOf } from "@storybook/react-native";

import withThemeProvider from "../../../enhancers/withThemeProvider";
import withExpoFontPreload from "../../../enhancers/withExpoFontPreload";
import PrimaryTheme from "../../../themes/PrimaryTheme";
import SignInForm from "../SignInForm";

const SignInFormEnhanced = withThemeProvider(
  withExpoFontPreload(SignInForm, PrimaryTheme.fonts),
  PrimaryTheme,
);

storiesOf("SignInForm", module).add("default", () => <SignInFormEnhanced />);
storiesOf("SignInForm", module).add("login error", () => (
  <SignInFormEnhanced errorMessage="Wrong email or password!" />
));
