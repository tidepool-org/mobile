import { NavigationActions } from "react-navigation";
import { Linking } from "react-native";

import Urls from "../constants/Urls";
import { AppNavigator } from "../navigators/AppNavigator";
import isRouteNameOnStack from "../utils/isRouteNameOnStack";
import getRouteName from "../utils/getRouteName";
import {
  ADD_COMMENT_ROUTE_NAME,
  ADD_NOTE_ROUTE_NAME,
  DEBUG_SETTINGS_ROUTE_NAME,
  EDIT_COMMENT_ROUTE_NAME,
  EDIT_NOTE_ROUTE_NAME,
  LAUNCH_ROUTE_NAME,
  MAIN_DRAWER_ROUTE_NAME,
  SIGN_IN_ROUTE_NAME,
  SWITCH_PROFILE_ROUTE_NAME,
} from "../navigators/routeNames";
import {
  NAVIGATE_LAUNCH,
  NAVIGATE_HOME,
  NAVIGATE_SIGN_IN,
  NAVIGATE_SIGN_UP,
  NAVIGATE_FORGOT_PASSWORD,
  NAVIGATE_SWITCH_PROFILE,
  NAVIGATE_ADD_NOTE,
  NAVIGATE_EDIT_NOTE,
  NAVIGATE_ADD_COMMENT,
  NAVIGATE_EDIT_COMMENT,
  NAVIGATE_PRIVACY_AND_TERMS,
  NAVIGATE_SUPPORT,
  NAVIGATE_DRAWER_OPEN,
  NAVIGATE_DRAWER_CLOSE,
  NAVIGATE_DEBUG_SETTINGS,
  NAVIGATE_GO_BACK,
} from "../actions/navigation";

// TODO: metrics - need metrics for navigation

const shouldIgnoreNextNavigate = ({ nextState, state }) => {
  // Prevent double navigation for some routes (e.g. when tapping UI elements that cause navigation quickly)
  // TODO: Revisit this. It's kind of hacky / fragile
  if (nextState !== state) {
    const nextRouteName = getRouteName({
      navigationState: nextState,
    });

    const routeNames = [
      SWITCH_PROFILE_ROUTE_NAME,
      ADD_NOTE_ROUTE_NAME,
      EDIT_NOTE_ROUTE_NAME,
      ADD_COMMENT_ROUTE_NAME,
      EDIT_COMMENT_ROUTE_NAME,
    ];
    if (
      nextRouteName &&
      routeNames.includes(nextRouteName) &&
      isRouteNameOnStack({
        routeName: nextRouteName,
        navigationState: state,
      })
    ) {
      return true;
    }
  }

  return false;
};

const signInAction = AppNavigator.router.getActionForPathAndParams(
  SIGN_IN_ROUTE_NAME
);
const SignInActionState = AppNavigator.router.getStateForAction(signInAction);
const initialState = AppNavigator.router.getStateForAction(
  signInAction,
  SignInActionState
);

function navigation(state = initialState, action) {
  let nextState;

  switch (action.type) {
    case NAVIGATE_LAUNCH:
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.reset({
          index: 0,
          key: null,
          actions: [
            NavigationActions.navigate({ routeName: LAUNCH_ROUTE_NAME }),
          ],
        }),
        state
      );
      break;
    case NAVIGATE_HOME:
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.reset({
          index: 0,
          key: null,
          actions: [
            NavigationActions.navigate({ routeName: MAIN_DRAWER_ROUTE_NAME }),
          ],
        }),
        state
      );
      break;
    case NAVIGATE_SIGN_IN:
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.reset({
          index: 0,
          key: null,
          actions: [
            NavigationActions.navigate({ routeName: SIGN_IN_ROUTE_NAME }),
          ],
        }),
        state
      );
      break;
    case NAVIGATE_SWITCH_PROFILE:
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({ routeName: SWITCH_PROFILE_ROUTE_NAME }),
        state
      );
      break;
    case NAVIGATE_ADD_NOTE:
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({
          routeName: ADD_NOTE_ROUTE_NAME,
          params: { note: action.payload.note },
        }),
        state
      );
      break;
    case NAVIGATE_EDIT_NOTE:
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({
          routeName: EDIT_NOTE_ROUTE_NAME,
          params: { note: action.payload.note },
        }),
        state
      );
      break;
    case NAVIGATE_ADD_COMMENT:
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({
          routeName: ADD_COMMENT_ROUTE_NAME,
          params: {
            note: action.payload.note,
            commentsFetchData: action.payload.commentsFetchData,
          },
        }),
        state
      );
      break;
    case NAVIGATE_EDIT_COMMENT:
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({
          routeName: EDIT_COMMENT_ROUTE_NAME,
          params: {
            note: action.payload.note,
            commentsFetchData: action.payload.commentsFetchData,
            comment: action.payload.comment,
          },
        }),
        state
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
    case NAVIGATE_DRAWER_OPEN:
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({ routeName: "DrawerOpen" }),
        state
      );
      break;
    case NAVIGATE_DRAWER_CLOSE:
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({ routeName: "DrawerClose" }),
        state
      );
      break;
    case NAVIGATE_DEBUG_SETTINGS:
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({ routeName: DEBUG_SETTINGS_ROUTE_NAME }),
        state
      );
      break;
    case NAVIGATE_GO_BACK:
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.back(),
        state
      );
      break;
    default:
      nextState = AppNavigator.router.getStateForAction(action, state);
      break;
  }

  nextState = nextState || state;
  if (shouldIgnoreNextNavigate({ nextState, state })) {
    nextState = state;
  }

  return nextState;
}

export default navigation;
