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
    drawerWidth: 270,
    contentComponent: DrawerContainer,
  },
);

export default MainDrawerNavigator;
