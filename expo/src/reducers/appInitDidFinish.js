import { APP_INIT_DID_FINISH } from "../actions/appInit";

function appInitDidFinish(state = false, action) {
  switch (action.type) {
    case APP_INIT_DID_FINISH:
      return action.payload;
    default:
      return state;
  }
}

export default appInitDidFinish;
