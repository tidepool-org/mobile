import { API_ENVIRONMENT_SET } from "../actions/apiEnvironment";
import { API_ENVIRONMENT_PRODUCTION } from "../api";

const initialApiEnvironmentState = API_ENVIRONMENT_PRODUCTION;

function apiEnvironment(state = initialApiEnvironmentState, action) {
  switch (action.type) {
    case API_ENVIRONMENT_SET:
      return action.payload;
    default:
      return state;
  }
}

export default apiEnvironment;
