import { combineReducers } from "redux";

import appInitDidFinish from "./appInitDidFinish";
import appVersion from "./appVersion";
import auth from "./auth";
import apiEnvironment from "./apiEnvironment";
import commentsFetch from "./commentsFetch";
import navigation from "./navigation";
import notesFetch from "./notesFetch";
import profile from "./profile";
import profilesFetch from "./profilesFetch";

const reducers = combineReducers({
  appInitDidFinish,
  appVersion,
  auth,
  apiEnvironment,
  commentsFetch,
  navigation,
  notesFetch,
  profile,
  profilesFetch,
});

export default reducers;
