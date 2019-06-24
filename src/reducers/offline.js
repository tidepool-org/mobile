import ConnectionStatus from "../models/ConnectionStatus";

import { OFFLINE_SET } from "../actions/offline";

const initialState = {
  isOffline: ConnectionStatus.isOffline,
};

function offline(state = initialState, action) {
  let nextState = state;

  switch (action.type) {
    case OFFLINE_SET:
      nextState = { ...state, isOffline: action.payload };
      break;
    default:
      break;
  }

  return nextState;
}

export default offline;
