import { combineReducers } from "redux";

import appVersion from "./appVersion";
import auth from "./auth";
import environment from "./environment";
import navigation from "./navigation";
import profile from "./profile";

const reducers = combineReducers({
  appVersion,
  auth,
  environment,
  navigation,
  profile,
});

export default reducers;
