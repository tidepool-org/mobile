import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Animated, Easing, BackHandler, UIManager } from "react-native";
import {
  addNavigationHelpers,
  NavigationActions,
  StackNavigator,
} from "react-navigation";
import { connect } from "react-redux";

import LaunchScreen from "../screens/LaunchScreen";
import SignInScreenContainer from "../containers/SignInScreenContainer";
import MainDrawerNavigator from "./MainDrawerNavigator";
import DebugSettingsScreenContainer from "../containers/DebugSettingsScreenContainer";
import getRouteName from "../utils/getRouteName";

const noTransitionConfig = () => ({
  transitionSpec: {
    duration: 0,
    timing: Animated.timing,
    easing: Easing.step0,
  },
});

export const AppNavigator = StackNavigator(
  {
    Launch: {
      screen: LaunchScreen,
    },
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
    transitionConfig: noTransitionConfig,
  }
);

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
    const routeName = getRouteName({ navigationState: navigation });
    if (routeName === "Home" || routeName === "SignIn") {
      return false;
    }
    dispatch(NavigationActions.back());
    return true;
  };

  render() {
    // console.log("AppWithNavigationState: render");
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
      })
    ).isRequired,
  }).isRequired,
};

const mapStateToProps = state => ({
  navigation: state.navigation,
});

export default connect(mapStateToProps)(AppWithNavigationState);
