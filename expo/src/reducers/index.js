import { combineReducers } from "redux";

import navigation from "./navigation";
import auth from "./auth";
import profile from "./profile";
import environment from "./environment";

const reducers = combineReducers({
  navigation,
  auth,
  profile,
  environment,
});

export default reducers;
