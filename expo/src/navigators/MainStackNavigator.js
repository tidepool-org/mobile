import { StackNavigator } from "react-navigation";

import HomeScreenContainer from "../containers/HomeScreenContainer";
import SwitchProfileScreenContainer from "../containers/SwitchProfileScreenContainer";

export const HOME_ROUTE_NAME = "Home";
export const SWITCH_PROFILE_ROUTE_NAME = "SwitchProfile";

const MainStackNavigator = StackNavigator(
  {
    [HOME_ROUTE_NAME]: {
      screen: HomeScreenContainer,
    },
    [SWITCH_PROFILE_ROUTE_NAME]: {
      screen: SwitchProfileScreenContainer,
    },
  },
  {
    headerMode: "float",
    headerBackTitle: "",
    headerTruncatedBackTitle: "",
  }
);

export default MainStackNavigator;
