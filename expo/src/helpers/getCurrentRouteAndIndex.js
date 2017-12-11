const getCurrentRouteRouteAndIndexHelper = (state, index) => {
  if (state.index !== undefined) {
    return getCurrentRouteRouteAndIndexHelper(
      state.routes[state.index],
      state.index,
    );
  }
  return { ...state, index };
};

const getCurrentRouteAndIndex = state =>
  getCurrentRouteRouteAndIndexHelper(state);

export default getCurrentRouteAndIndex;
