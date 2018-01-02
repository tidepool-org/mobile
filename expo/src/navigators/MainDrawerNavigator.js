import { DrawerNavigator } from "react-navigation";

import MainStackNavigator from "./MainStackNavigator";
import DrawerContainer from "../containers/DrawerContainer";

const MainDrawerNavigator = DrawerNavigator(
  {
    MainStack: {
      screen: MainStackNavigator,
    },
  },
  {
    drawerOpenRoute: "DrawerOpen",
    drawerCloseRoute: "DrawerClose",
    drawerToggleRoute: "DrawerToggle",
    drawerWidth: 270,
    contentComponent: DrawerContainer,
  }
);

export default MainDrawerNavigator;
