import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";

import LaunchScreen from "../screens/LaunchScreen";
import SignInScreenContainer from "../containers/SignInScreenContainer";
import DebugSettingsScreenContainer from "../containers/DebugSettingsScreenContainer";
import HomeScreenContainer from "../containers/HomeScreenContainer";
import SwitchProfileScreenContainer from "../containers/SwitchProfileScreenContainer";
import AddOrEditCommentScreenContainer from "../containers/AddOrEditCommentScreenContainer";
import AddOrEditNoteScreenContainer from "../containers/AddOrEditNoteScreenContainer";
import DrawerContainer from "../containers/DrawerContainer";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const MainStackNavigator = () => (
  <Stack.Navigator
    headerMode="float"
    screenOptions={{
      headerBackTitle: "",
      headerTruncatedBackTitle: "",
    }}
  >
    <Stack.Screen name="Home" component={HomeScreenContainer} />
    <Stack.Screen name="SwitchProfile" component={SwitchProfileScreenContainer} />
    <Stack.Screen name="AddComment" component={AddOrEditCommentScreenContainer} />
    <Stack.Screen name="EditComment" component={AddOrEditCommentScreenContainer} />
  </Stack.Navigator>
);

const MainDrawerNavigator = () => (
  <Drawer.Navigator
  drawerType="slide"
  drawerWidth={270}
  drawerContent={(props) => <DrawerContainer {...props} />}
>
  <Drawer.Screen name="MainStack" component={MainStackNavigator} />
  {/* Add more drawer items if needed */}
</Drawer.Navigator>
);

const MainModalNavigator = () => (
  <Stack.Navigator
    mode="modal"
    headerMode="none"
    screenOptions={{
      cardStyle: { backgroundColor: "transparent" },
      cardOverlayEnabled: true,
    }}
  >
    <Stack.Screen name="MainDrawer" component={MainDrawerNavigator} />
    <Stack.Screen name="AddNote" component={AddOrEditNoteScreenContainer} />
    <Stack.Screen name="EditNote" component={AddOrEditNoteScreenContainer} />
  </Stack.Navigator>
);

const AppNavigator = () => (
  <Stack.Navigator headerMode="none">
    <Stack.Screen name="Launch" component={LaunchScreen} />
    <Stack.Screen name="SignIn" component={SignInScreenContainer} />
    <Stack.Screen name="DebugSettings" component={DebugSettingsScreenContainer} />
    <Stack.Screen name="MainModal" component={MainModalNavigator} />
  </Stack.Navigator>
);

export default AppNavigator;