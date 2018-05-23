import { APP_VERSION_LOAD } from "../actions/appVersion";

const initialAppVersionState = "";

function appVersion(state = initialAppVersionState, action) {
  switch (action.type) {
    case APP_VERSION_LOAD:
      return action.payload;
    default:
      return state;
  }
}

export default appVersion;
