import { NavigationActions } from "react-navigation";
import { Linking } from "react-native";

import Urls from "../constants/Urls";
import { AppNavigator } from "../navigators/AppNavigator";
import getCurrentRouteAndIndex from "../helpers/getCurrentRouteAndIndex";

// TODO: metrics

const signInAction = AppNavigator.router.getActionForPathAndParams("SignIn");
const SignInActionState = AppNavigator.router.getStateForAction(signInAction);
const initialNavState = AppNavigator.router.getStateForAction(
  signInAction,
  SignInActionState,
);

function navigation(state = initialNavState, action) {
  let nextState;
  switch (action.type) {
    case "SignIn":
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.reset({
          index: 0,
          key: null,
          actions: [NavigationActions.navigate({ routeName: "MainDrawer" })],
        }),
        state,
      );
      break;
    case "SignOut":
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.reset({
          index: 0,
          key: null,
          actions: [NavigationActions.navigate({ routeName: "SignIn" })],
        }),
        state,
      );
      break;
    case "SwitchProfile":
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({ routeName: "SwitchProfile" }),
        state,
      );
      break;
    case "PrivacyAndTerms":
      Linking.openURL(Urls.privacyAndTerms);
      break;
    case "Support":
      Linking.openURL(Urls.support);
      break;
    case "DrawerOpen":
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({ routeName: "DrawerOpen" }),
        state,
      );
      break;
    case "DrawerClose":
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({ routeName: "DrawerClose" }),
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
