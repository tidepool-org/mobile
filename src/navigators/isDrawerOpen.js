// import Logger from "../models/Logger";

const isDrawerOpen = ({ navigation: rootNavigationState }) => {
  let result = false;

  if (rootNavigationState) {
    result =
      rootNavigationState.routes &&
      rootNavigationState.routes.length &&
      !!rootNavigationState.routes[0].isDrawerOpen;
  }

  // console.log(`isDrawerOpen: ${result}`);

  return result;
};

export default isDrawerOpen;
