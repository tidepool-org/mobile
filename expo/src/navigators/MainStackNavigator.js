import { StackNavigator } from "react-navigation";

import HomeScreenContainer from "../containers/HomeScreenContainer";
import SwitchProfileScreenContainer from "../containers/SwitchProfileScreenContainer";

const MainStackNavigator = StackNavigator(
  {
    Home: {
      screen: HomeScreenContainer,
    },
    SwitchProfile: {
      screen: SwitchProfileScreenContainer,
    },
  },
  {
    headerMode: "screen",
    headerBackTitle: "",
    headerTruncatedBackTitle: "",
  },
);

export default MainStackNavigator;
