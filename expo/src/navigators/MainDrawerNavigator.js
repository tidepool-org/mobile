import { DrawerNavigator } from "react-navigation";

import MainStackNavigator from "./MainStackNavigator";
import DrawerContainer from "../containers/DrawerContainer";
import withThemeProvider from "../enhancers/withThemeProvider";
import PrimaryTheme from "../themes/PrimaryTheme";

const MainDrawerNavigator = DrawerNavigator(
  {
    MainStack: {
      screen: MainStackNavigator,
    },
  },
  {
    drawerWidth: 270,
    contentComponent: withThemeProvider(DrawerContainer, PrimaryTheme),
  },
);

export default MainDrawerNavigator;
