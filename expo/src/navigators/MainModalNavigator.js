import { createStackNavigator } from "react-navigation";

import MainStackNavigator from "./MainStackNavigator";
import AddOrEditNoteScreenContainer from "../containers/AddOrEditNoteScreenContainer";
import { ADD_NOTE_ROUTE_NAME, EDIT_NOTE_ROUTE_NAME } from "./routeNames";

const transitionConfig = () => ({
  transitionSpec: {
    duration: 350,
  },
});

const MainModalNavigator = createStackNavigator(
  {
    MainStackNavigator: { screen: MainStackNavigator },
    [ADD_NOTE_ROUTE_NAME]: {
      screen: AddOrEditNoteScreenContainer,
    },
    [EDIT_NOTE_ROUTE_NAME]: {
      screen: AddOrEditNoteScreenContainer,
    },
  },
  {
    mode: "modal",
    headerMode: "none",
    transitionConfig,
  }
);

export default MainModalNavigator;
