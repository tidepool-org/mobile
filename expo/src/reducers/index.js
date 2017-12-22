import { combineReducers } from "redux";

import appInitDidFinish from "./appInitDidFinish";
import appVersion from "./appVersion";
import auth from "./auth";
import apiEnvironment from "./apiEnvironment";
import navigation from "./navigation";
import profile from "./profile";

const reducers = combineReducers({
  appInitDidFinish,
  appVersion,
  auth,
  apiEnvironment,
  navigation,
  profile,
});

export default reducers;
