import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Animated, Easing, BackHandler } from "react-native";
import {
  addNavigationHelpers,
  NavigationActions,
  StackNavigator,
} from "react-navigation";
import { connect } from "react-redux";

import getCurrentRouteAndIndex from "../utils/getCurrentRouteAndIndex";
import SignInScreenContainer from "../containers/SignInScreenContainer";
import MainDrawerNavigator from "./MainDrawerNavigator";
import DebugSettingsScreenContainer from "../containers/DebugSettingsScreenContainer";

const noTransitionConfig = () => ({
  transitionSpec: {
    duration: 0,
    timing: Animated.timing,
    easing: Easing.step0,
  },
});

export const AppNavigator = StackNavigator(
  {
    SignIn: {
      screen: props => <SignInScreenContainer {...props} />,
    },
    DebugSettings: {
      screen: () => <DebugSettingsScreenContainer />,
    },
    MainDrawer: {
      screen: MainDrawerNavigator,
    },
  },
  {
    headerMode: "none",
    initialRouteName: "SignIn",
    transitionConfig: noTransitionConfig,
  },
);

class AppWithNavigationState extends PureComponent {
  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
  }

  onBackPress = () => {
    const { dispatch, navigation } = this.props;
    if (getCurrentRouteAndIndex(navigation).index === 0) {
      return false;
    }
    dispatch(NavigationActions.back());
    return true;
  };

  render() {
    const { dispatch, navigation } = this.props;
    return (
      <AppNavigator
        navigation={addNavigationHelpers({
          dispatch,
          state: navigation,
        })}
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
      }),
    ).isRequired,
  }).isRequired,
};

const mapStateToProps = state => ({
  navigation: state.navigation,
});

export default connect(mapStateToProps)(AppWithNavigationState);
