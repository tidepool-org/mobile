import { PROFILE_SET_CURRENT_PROFILE } from "../actions/profile";

const initialProfileState = {
  currentProfile: {
    userId: "",
    fullName: "",
  },
};

function profile(state = initialProfileState, action) {
  switch (action.type) {
    case PROFILE_SET_CURRENT_PROFILE:
      return { currentProfile: action.payload };
    default:
      return state;
  }
}

export default profile;
