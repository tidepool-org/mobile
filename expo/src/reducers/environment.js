import { ENVIRONMENT_SET_CURRENT_ENVIRONMENT } from "../actions/environment";
import { ENVIRONMENT_PRODUCTION } from "../api";

const initialEnvironmentState = ENVIRONMENT_PRODUCTION;

function environment(state = initialEnvironmentState, action) {
  switch (action.type) {
    case ENVIRONMENT_SET_CURRENT_ENVIRONMENT:
      return action.payload;
    default:
      return state;
  }
}

export default environment;
