import React from "react";
import { View } from "react-native";
import { DrawerNavigator } from "react-navigation";

import MainStackNavigator from "./MainStackNavigator";

const MainDrawerNavigator = DrawerNavigator(
  {
    MainStack: {
      screen: MainStackNavigator,
    },
  },
  {
    drawerWidth: 270,
    contentComponent: () => <View style={{ flex: 1, marginTop: 0 }} />,
  },
);

export default MainDrawerNavigator;
