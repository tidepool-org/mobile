import React from "react";
import { Animated, Easing } from "react-native";
import { StackNavigator } from "react-navigation";

import LaunchScreen from "../screens/LaunchScreen";
import SignInScreenContainer from "../containers/SignInScreenContainer";
import MainDrawerNavigator from "./MainDrawerNavigator";
import DebugSettingsScreenContainer from "../containers/DebugSettingsScreenContainer";

const noTransitionConfig = () => ({
  transitionSpec: {
    duration: 0,
    timing: Animated.timing,
    easing: Easing.step0,
  },
});

const AppNavigator = StackNavigator(
  {
    Launch: {
      screen: LaunchScreen,
    },
    SignIn: {
      screen: props => <SignInScreenContainer {...props} />,
    },
    DebugSettings: {
      screen: () => <DebugSettingsScreenContainer />,
    },
    MainDrawer: {
      screen: MainDrawerNavigator,
    },
  },
  {
    headerMode: "none",
    transitionConfig: noTransitionConfig,
  }
);

export { AppNavigator };
