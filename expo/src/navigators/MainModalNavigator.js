import { StackNavigator } from "react-navigation";

import MainStackNavigator from "./MainStackNavigator";
import AddOrEditNoteScreenContainer from "../containers/AddOrEditNoteScreenContainer";

export const ADD_NOTE_ROUTE_NAME = "AddNote";
export const EDIT_NOTE_ROUTE_NAME = "EditNote";

const transitionConfig = () => ({
  transitionSpec: {
    duration: 250,
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
