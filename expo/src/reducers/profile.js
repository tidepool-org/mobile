import { PROFILE_SET } from "../actions/profile";

const initialProfileState = {
  currentProfile: {
    userId: "",
    fullName: "",
  },
};

function profile(state = initialProfileState, action) {
  switch (action.type) {
    case PROFILE_SET:
      return { currentProfile: action.payload };
    default:
      return state;
  }
}

export default profile;
