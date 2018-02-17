import { StackNavigator } from "react-navigation";

import MainStackNavigator from "./MainStackNavigator";
import AddOrEditNoteScreenContainer from "../containers/AddOrEditNoteScreenContainer";

export const ADD_NOTE_ROUTE_NAME = "ADD_NOTE_ROUTE_NAME";
export const EDIT_NOTE_ROUTE_NAME = "EDIT_NOTE_ROUTE_NAME";

const transitionConfig = () => ({
  transitionSpec: {
    duration: 350,
  },
});

const MainModalNavigator = StackNavigator(
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
