import { StackNavigator } from "react-navigation";

import HomeScreenContainer from "../containers/HomeScreenContainer";
import SwitchProfileScreenContainer from "../containers/SwitchProfileScreenContainer";
import AddOrEditCommentScreenContainer from "../containers/AddOrEditCommentScreenContainer";
import {
  HOME_ROUTE_NAME,
  SWITCH_PROFILE_ROUTE_NAME,
  ADD_COMMENT_ROUTE_NAME,
  EDIT_COMMENT_ROUTE_NAME,
} from "./routeNames";

const MainStackNavigator = StackNavigator(
  {
    [HOME_ROUTE_NAME]: {
      screen: HomeScreenContainer,
    },
    [SWITCH_PROFILE_ROUTE_NAME]: {
      screen: SwitchProfileScreenContainer,
    },
    [ADD_COMMENT_ROUTE_NAME]: {
      screen: AddOrEditCommentScreenContainer,
    },
    [EDIT_COMMENT_ROUTE_NAME]: {
      screen: AddOrEditCommentScreenContainer,
    },
  },
  {
    headerMode: "float",
    headerTransitionPreset: "uikit",
    headerBackTitle: "",
    headerTruncatedBackTitle: "",
  }
);

export default MainStackNavigator;
