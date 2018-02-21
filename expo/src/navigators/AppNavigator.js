import React from "react";
import { Animated, Easing } from "react-native";
import { StackNavigator } from "react-navigation";

import LaunchScreen from "../screens/LaunchScreen";
import SignInScreenContainer from "../containers/SignInScreenContainer";
import MainDrawerNavigator from "./MainDrawerNavigator";
import DebugSettingsScreenContainer from "../containers/DebugSettingsScreenContainer";
import {
  LAUNCH_ROUTE_NAME,
  SIGN_IN_ROUTE_NAME,
  DEBUG_SETTINGS_ROUTE_NAME,
  MAIN_DRAWER_ROUTE_NAME,
} from "./routeNames";

const noTransitionConfig = () => ({
  transitionSpec: {
    duration: 0,
    timing: Animated.timing,
    easing: Easing.step0,
  },
});

const AppNavigator = StackNavigator(
  {
    [LAUNCH_ROUTE_NAME]: {
      screen: LaunchScreen,
    },
    [SIGN_IN_ROUTE_NAME]: {
      screen: props => <SignInScreenContainer {...props} />,
    },
    [DEBUG_SETTINGS_ROUTE_NAME]: {
      screen: () => <DebugSettingsScreenContainer />,
    },
    [MAIN_DRAWER_ROUTE_NAME]: {
      screen: MainDrawerNavigator,
    },
  },
  {
    headerMode: "none",
    transitionConfig: noTransitionConfig,
  }
);

export { AppNavigator };
