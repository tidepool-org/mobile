import { LOG_LEVEL_SET } from "../actions/logLevel";
import { Logger } from "../models/Logger";

const initialState = Logger.LOG_LEVEL_DEFAULT;

function logLevel(state = initialState, action) {
  switch (action.type) {
    case LOG_LEVEL_SET:
      return action.payload;
    default:
      return state;
  }
}

export default logLevel;
