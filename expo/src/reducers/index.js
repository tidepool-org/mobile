import { combineReducers } from "redux";

import navigation from "./navigation";
import authentication from "./authentication";

const AppReducer = combineReducers({
  navigation,
  authentication,
});

export default AppReducer;
