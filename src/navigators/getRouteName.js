const getRouteName = ({ navigation: rootNavigationState }) => {
  const result = {
    routeName: rootNavigationState ? rootNavigationState.routeName : "",
    isTransitioning: rootNavigationState
      ? rootNavigationState.isTransitioning
      : false,
  };
  let navigationState = rootNavigationState;
  let nextNavigationStateIndex = navigationState
    ? navigationState.index
    : undefined;
  while (nextNavigationStateIndex !== undefined) {
    navigationState = navigationState.routes[nextNavigationStateIndex];
    nextNavigationStateIndex = navigationState.index;
    result.routeName = navigationState.routeName;
    if (navigationState.isTransitioning) {
      result.isTransitioning = true;
    }
  }

  result.params = navigationState.params;

  return result;
};

export default getRouteName;
