import getRouteName from "./getRouteName";

const isCurrentRoute = (targetRouteName, { navigation }) => {
  let result = false;

  if (navigation) {
    const { routeName, isTransitioning } = getRouteName({ navigation });
    if (routeName === targetRouteName && !isTransitioning) {
      result = true;
    }
  }

  // console.log(`isCurrentRoute: ${result}`);

  return result;
};

export default isCurrentRoute;
