const isRouteNameOnStack = ({
  routeName: targetRouteName,
  navigationState: rootNavigationState,
}) => {
  if (rootNavigationState.routeName === targetRouteName) {
    return true;
  }

  let navigationState = rootNavigationState;
  let nextNavigationStateIndex = navigationState.index;
  while (nextNavigationStateIndex !== undefined) {
    navigationState = navigationState.routes[nextNavigationStateIndex];
    nextNavigationStateIndex = navigationState.index;
    if (navigationState.routeName === targetRouteName) {
      return true;
    }
  }

  return false;
};

export default isRouteNameOnStack;
