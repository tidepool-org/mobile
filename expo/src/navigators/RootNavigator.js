import { StackNavigator } from "react-navigation";

import SignInScreen from "../screens/SignInScreen";
import MainDrawerNavigator from "./MainDrawerNavigator";
import withThemeProvider from "../enhancers/withThemeProvider";
import PrimaryTheme from "../themes/PrimaryTheme";

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
