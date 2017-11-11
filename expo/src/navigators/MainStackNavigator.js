import { StackNavigator } from "react-navigation";

import HomeScreen from "../screens/HomeScreen";

const MainStackNavigator = StackNavigator(
  {
    Home: {
      screen: HomeScreen,
    },
  },
  {
    headerMode: "screen",
    headerBackTitle: "",
    headerTruncatedBackTitle: "",
  },
);

export default MainStackNavigator;
