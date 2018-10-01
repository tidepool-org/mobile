import { combineReducers } from "redux";

import appInitDidFinish from "./appInitDidFinish";
import appVersion from "./appVersion";
import auth from "./auth";
import apiEnvironment from "./apiEnvironment";
import graphRenderer from "./graphRenderer";
import commentsFetch from "./commentsFetch";
import graphDataFetch from "./graphDataFetch";
import navigation from "./navigation";
import notesFetch from "./notesFetch";
import currentProfile from "./currentProfile";
import profilesFetch from "./profilesFetch";
import firstTimeTips from "./firstTimeTips";
import logLevel from "./logLevel";

const reducers = combineReducers({
  appInitDidFinish,
  appVersion,
  auth,
  apiEnvironment,
  graphRenderer,
  commentsFetch,
  graphDataFetch,
  navigation,
  notesFetch,
  currentProfile,
  profilesFetch,
  firstTimeTips,
  logLevel,
});

export default reducers;
