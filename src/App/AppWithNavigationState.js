import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { BackHandler, UIManager } from "react-native";
import { NavigationActions } from "react-navigation";
import { connect } from "react-redux";

import { AppNavigator } from "../navigators/AppNavigator";
import { HOME_ROUTE_NAME, SIGN_IN_ROUTE_NAME } from "../navigators/routeNames";
import getRouteName from "../navigators/getRouteName";
// import Logger from "../models/Logger";

class AppWithNavigationState extends PureComponent {
  componentDidMount() {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
  }

  onBackPress = () => {
    const { dispatch, navigation } = this.props;
    const { routeName } = getRouteName({ navigation });
    if (routeName === HOME_ROUTE_NAME || routeName === SIGN_IN_ROUTE_NAME) {
      return false;
    }
    dispatch(NavigationActions.back());
    return true;
  };

  render() {
    // console.log(`AppWithNavigationState: render`);
    const { addListener, dispatch, navigation } = this.props;

    return (
      <AppNavigator
        navigation={{
          dispatch,
          state: navigation,
          addListener,
        }}
      />
    );
  }
}

AppWithNavigationState.propTypes = {
  dispatch: PropTypes.func.isRequired,
  navigation: PropTypes.shape({
    index: PropTypes.number.isRequired,
    routes: PropTypes.arrayOf(
      PropTypes.shape({
        routeName: PropTypes.string.isRequired,
        key: PropTypes.string,
      })
    ).isRequired,
  }).isRequired,
  addListener: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  navigation: state.navigation,
});

export default connect(mapStateToProps)(AppWithNavigationState);
