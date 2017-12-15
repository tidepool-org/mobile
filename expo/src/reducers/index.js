import { combineReducers } from "redux";

import navigation from "./navigation";
import auth from "./auth";

const reducers = combineReducers({
  navigation,
  auth,
});

export default reducers;
