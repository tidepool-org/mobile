const initialAuthState = { isSignedIn: false };

function auth(state = initialAuthState, action) {
  switch (action.type) {
    case "SignIn":
      return { ...state, isSignedIn: true };
    case "SignOut":
      return { ...state, isSignedIn: false };
    default:
      return state;
  }
}

export default auth;
