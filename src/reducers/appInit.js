import { APP_INIT_DID_FINISH } from "../actions/appInit";

const initialState = {
  appInitDidFinish: false,
};

function appInit(state = initialState, action) {
  let nextState = state;

  switch (action.type) {
    case APP_INIT_DID_FINISH:
      nextState = { ...state, appInitDidFinish: action.payload };
      break;
    default:
      break;
  }

  return nextState;
}

export default appInit;
