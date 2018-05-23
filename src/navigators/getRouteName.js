const getRouteName = ({ navigationState: rootNavigationState }) => {
  let resultRouteName = rootNavigationState
    ? rootNavigationState.routeName
    : "";

  let navigationState = rootNavigationState;
  let nextNavigationStateIndex = navigationState
    ? navigationState.index
    : undefined;
  while (nextNavigationStateIndex !== undefined) {
    navigationState = navigationState.routes[nextNavigationStateIndex];
    nextNavigationStateIndex = navigationState.index;
    resultRouteName = navigationState.routeName;
  }

  return resultRouteName;
};

export default getRouteName;
