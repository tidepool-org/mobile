import { createStackNavigator } from "react-navigation";

import HomeScreenContainer from "../containers/HomeScreenContainer";
import SwitchProfileScreenContainer from "../containers/SwitchProfileScreenContainer";
import HealthSyncScreenContainer from "../containers/HealthSyncScreenContainer";
import AddOrEditCommentScreenContainer from "../containers/AddOrEditCommentScreenContainer";
import {
  HOME_ROUTE_NAME,
  HEALTH_SYNC_ROUTE_NAME,
  SWITCH_PROFILE_ROUTE_NAME,
  ADD_COMMENT_ROUTE_NAME,
  EDIT_COMMENT_ROUTE_NAME,
} from "./routeNames";

const MainStackNavigator = createStackNavigator(
  {
    [HOME_ROUTE_NAME]: {
      screen: HomeScreenContainer,
    },
    [HEALTH_SYNC_ROUTE_NAME]: {
      screen: HealthSyncScreenContainer,
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
