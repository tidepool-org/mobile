const initialAuthState = { isSignedIn: false };

function authentication(state = initialAuthState, action) {
  switch (action.type) {
    case "SignIn":
      return { ...state, isSignedIn: true };
    case "SignOut":
      return { ...state, isSignedIn: false };
    default:
      return state;
  }
}

export default authentication;
