import { StackNavigator } from "react-navigation";

import withThemeProvider from "../enhancers/withThemeProvider";
import PrimaryTheme from "../themes/PrimaryTheme";
import SignInScreen from "../screens/SignInScreen";
import MainDrawerNavigator from "./MainDrawerNavigator";

const RootNavigator = StackNavigator(
  {
    SignIn: {
      screen: withThemeProvider(SignInScreen, PrimaryTheme),
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
