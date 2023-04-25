import * as React from 'react';
import { Linking } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Urls from '../constants/Urls';

import AddOrEditCommentScreen from '../screens/AddOrEditCommentScreen';
import AddOrEditNoteScreen from '../screens/AddOrEditNoteScreen';
import DebugSettingsScreen from '../screens/DebugSettingsScreen';
import HomeScreen from '../screens/HomeScreen';
import LaunchScreen from '../screens/LaunchScreen';
import SignInScreen from '../screens/SignInScreen';
import SwitchProfileScreen from '../screens/SwitchProfileScreen';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function RootStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Launch" component={LaunchScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="SignIn" component={SignInScreen} />
      
    </Stack.Navigator>
  );
}

function AppNavigation() {
  return (
    <NavigationContainer>
      <Drawer.Navigator>
      <Drawer.Screen name="Root" component={RootStack} />
      <Drawer.Screen name="SwitchProfile" component={SwitchProfileScreen} />
      <Drawer.Screen name="AddNote" component={AddOrEditNoteScreen} />
      <Drawer.Screen name="EditNote" component={AddOrEditNoteScreen} />
      <Drawer.Screen name="AddComment" component={AddOrEditCommentScreen} />
      <Drawer.Screen name="EditComment" component={AddOrEditCommentScreen} />
      <Drawer.Screen name="DebugSettings" component={DebugSettingsScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigation;

// Navigation functions
export function navigateToURL(url) {
  Linking.openURL(url);
}

export function navigateToPrivacyAndTerms() {
  navigateToURL(Urls.privacyAndTerms);
}

export function navigateToSupport() {
  navigateToURL(Urls.support);
}

export function navigateToForgotPassword() {
  navigateToURL(Urls.forgotPassword);
}

export function navigateToSignUp() {
  navigateToURL(Urls.signUp);
}

export function navigateToHowToUpload() {
  navigateToURL(Urls.howToUpload);
}
