import { combineReducers } from "redux";

import appInitDidFinish from "./appInitDidFinish";
import appVersion from "./appVersion";
import auth from "./auth";
import apiEnvironment from "./apiEnvironment";
import commentsFetch from "./commentsFetch";
import graphDataFetch from "./graphDataFetch";
import navigation from "./navigation";
import notesFetch from "./notesFetch";
import currentProfile from "./currentProfile";
import profilesFetch from "./profilesFetch";

const reducers = combineReducers({
  appInitDidFinish,
  appVersion,
  auth,
  apiEnvironment,
  commentsFetch,
  graphDataFetch,
  navigation,
  notesFetch,
  currentProfile,
  profilesFetch,
});

export default reducers;
