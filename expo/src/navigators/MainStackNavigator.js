import { StackNavigator } from "react-navigation";

import HomeScreen from "../screens/HomeScreen";
import SwitchProfileScreen from "../screens/SwitchProfileScreen";

const MainStackNavigator = StackNavigator(
  {
    Home: {
      screen: HomeScreen,
    },
    SwitchProfile: {
      screen: SwitchProfileScreen,
    },
  },
  {
    headerMode: "screen",
    headerBackTitle: "",
    headerTruncatedBackTitle: "",
  },
);

export default MainStackNavigator;
