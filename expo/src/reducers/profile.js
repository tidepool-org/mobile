import { PROFILE_SET } from "../actions/profile";
import { AUTH_SIGN_IN_RESET } from "../actions/auth";

const initialState = {
  currentProfile: {
    userId: "",
    fullName: "",
  },
};

function profile(state = initialState, action) {
  let nextState = state;

  switch (action.type) {
    case AUTH_SIGN_IN_RESET:
      nextState = initialState;
      break;
    case PROFILE_SET:
      nextState = { currentProfile: action.payload };
      break;
    default:
      break;
  }

  return nextState;
}

export default profile;
