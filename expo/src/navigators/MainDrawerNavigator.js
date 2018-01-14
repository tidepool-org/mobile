import { DrawerNavigator } from "react-navigation";

import MainModalNavigator from "./MainModalNavigator";
import DrawerContainer from "../containers/DrawerContainer";

const MainDrawerNavigator = DrawerNavigator(
  {
    MainStack: {
      screen: MainModalNavigator,
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
