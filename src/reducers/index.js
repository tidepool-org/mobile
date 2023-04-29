import { combineReducers } from "redux";

import appInit from "./appInit";
import offline from "./offline";
import appVersion from "./appVersion";
import auth from "./auth";
import apiCacheExpiration from "./apiCacheExpiration";
import apiEnvironment from "./apiEnvironment";
import graphRenderer from "./graphRenderer";
import commentsFetch from "./commentsFetch";
import graphDataFetch from "./graphDataFetch";
import notesFetch from "./notesFetch";
import currentProfile from "./currentProfile";
import profilesFetch from "./profilesFetch";
import firstTimeTips from "./firstTimeTips";
import logLevel from "./logLevel";

const reducers = combineReducers({
  apiCacheExpiration,
  apiEnvironment,
  appInit,
  appVersion,
  auth,
  commentsFetch,
  currentProfile,
  firstTimeTips,
  graphDataFetch,
  graphRenderer,
  logLevel,
  notesFetch,
  offline,
  profilesFetch,
});

export default reducers;
