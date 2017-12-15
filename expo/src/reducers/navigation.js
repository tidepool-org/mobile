import { NavigationActions } from "react-navigation";
import { Linking } from "react-native";

import Urls from "../constants/Urls";
import { AppNavigator } from "../navigators/AppNavigator";
import getCurrentRouteAndIndex from "../utils/getCurrentRouteAndIndex";
import {
  NAVIGATE_HOME,
  NAVIGATE_SIGN_IN,
  NAVIGATE_SIGN_UP,
  NAVIGATE_FORGOT_PASSWORD,
  NAVIGATE_SWITCH_PROFILE,
  NAVIGATE_PRIVACY_AND_TERMS,
  NAVIGATE_SUPPORT,
  NAVIGATE_SIGN_DRAWER_OPEN,
  NAVIGATE_SIGN_DRAWER_CLOSE,
  NAVIGATE_GO_BACK,
} from "../actions/navigation";

// TODO: metrics - need metrics for navigation

const signInAction = AppNavigator.router.getActionForPathAndParams("SignIn");
const SignInActionState = AppNavigator.router.getStateForAction(signInAction);
const initialState = AppNavigator.router.getStateForAction(
  signInAction,
  SignInActionState,
);

function navigation(state = initialState, action) {
  let nextState;
  switch (action.type) {
    case NAVIGATE_HOME:
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.reset({
          index: 0,
          key: null,
          actions: [NavigationActions.navigate({ routeName: "MainDrawer" })],
        }),
        state,
      );
      break;
    case NAVIGATE_SIGN_IN:
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.reset({
          index: 0,
          key: null,
          actions: [NavigationActions.navigate({ routeName: "SignIn" })],
        }),
        state,
      );
      break;
    case NAVIGATE_SWITCH_PROFILE:
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({ routeName: "SwitchProfile" }),
        state,
      );
      break;
    case NAVIGATE_PRIVACY_AND_TERMS:
      Linking.openURL(Urls.privacyAndTerms);
      break;
    case NAVIGATE_SUPPORT:
      Linking.openURL(Urls.support);
      break;
    case NAVIGATE_FORGOT_PASSWORD:
      Linking.openURL(Urls.forgotPassword);
      break;
    case NAVIGATE_SIGN_UP:
      Linking.openURL(Urls.signUp);
      break;
    case NAVIGATE_SIGN_DRAWER_OPEN:
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({ routeName: "DrawerOpen" }),
        state,
      );
      break;
    case NAVIGATE_SIGN_DRAWER_CLOSE:
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({ routeName: "DrawerClose" }),
        state,
      );
      break;
    case NAVIGATE_GO_BACK:
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.back(),
        state,
      );
      break;
    default:
      nextState = AppNavigator.router.getStateForAction(action, state);
      break;
  }

  nextState = nextState || state;

  // Prevent navigating to same route twice
  const currentRoute = getCurrentRouteAndIndex(state);
  const nextRoute = getCurrentRouteAndIndex(nextState);
  if (currentRoute.routeName === nextRoute.routeName) {
    nextState = state;
  }

  return nextState;
}

export default navigation;
