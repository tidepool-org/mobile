import React from "react";
import { StackNavigator } from "react-navigation";
import { ThemeProvider } from "glamorous-native";

import SignInScreen from "../screens/SignInScreen";
import MainDrawerNavigator from "./MainDrawerNavigator";
import PrimaryTheme from "../themes/PrimaryTheme";

const RootNavigator = StackNavigator(
  {
    SignIn: {
      screen: props => (
        <ThemeProvider theme={PrimaryTheme}>
          <SignInScreen {...props} />
        </ThemeProvider>
      ),
    },
    MainDrawer: {
      screen: MainDrawerNavigator,
    },
  },
  {
    headerMode: "none",
    initialRouteName: "SignIn",
  },
);

export default RootNavigator;
