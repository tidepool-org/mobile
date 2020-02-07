import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { AppState, BackHandler, UIManager } from "react-native";
import { NavigationActions } from "react-navigation";
import { connect } from "react-redux";

import { AppNavigator } from "../navigators/AppNavigator";
import { HOME_ROUTE_NAME, SIGN_IN_ROUTE_NAME } from "../navigators/routeNames";
import getRouteName from "../navigators/getRouteName";
import { TPNativeHealth } from "../models/TPNativeHealth";
import { healthStateSet } from "../actions/health";

import { authRefreshToken } from "../actions/auth";
// import { Logger } from "../models/Logger";

class AppWithNavigationState extends PureComponent {
  state = {
    appState: AppState.currentState,
  };

  componentDidMount() {
    const { dispatch } = this.props;

    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    AppState.addEventListener("change", this.onAppStateChange);
    BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
    TPNativeHealth.addListener(this.onHealthEvent);

    // Do initial dispatch of health state when mounting. Further updates are by way of TPNativeHealth events
    dispatch(
      healthStateSet({
        ...TPNativeHealth.healthKitInterfaceConfiguration,
        turnOffUploaderReason: TPNativeHealth.turnOffUploaderReason,
        turnOffUploaderError: TPNativeHealth.turnOffUploaderError,
        isHistoricalUploadPending:
          TPNativeHealth.isHistoricalUploadPending,
        isUploadingHistorical: TPNativeHealth.isUploadingHistorical,
        historicalUploadCurrentDay: TPNativeHealth.historicalUploadCurrentDay,
        historicalUploadTotalDays: TPNativeHealth.historicalUploadTotalDays,
        lastCurrentUploadUiDescription:
          TPNativeHealth.lastCurrentUploadUiDescription,
      })
    );
  }

  componentWillUnmount() {
    AppState.removeEventListener("change", this.onAppStateChange);
    BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
    TPNativeHealth.removeListener(this.onHealthEvent);
  }

  onHealthEvent = (eventName, uploaderType) => {
    const { dispatch } = this.props;

    if (eventName === "onHealthKitInterfaceConfiguration") {
      dispatch(
        healthStateSet({
          ...TPNativeHealth.healthKitInterfaceConfiguration,
          turnOffUploaderReason: TPNativeHealth.turnOffUploaderReason,
          turnOffUploaderError: TPNativeHealth.turnOffUploaderError,
          isHistoricalUploadPending:
            TPNativeHealth.isHistoricalUploadPending,
          isUploadingHistorical: TPNativeHealth.isUploadingHistorical,
          historicalUploadCurrentDay: TPNativeHealth.historicalUploadCurrentDay,
          historicalUploadTotalDays: TPNativeHealth.historicalUploadTotalDays,
          lastCurrentUploadUiDescription:
            TPNativeHealth.lastCurrentUploadUiDescription,
        })
      );
    } else if (
      eventName === "onTurnOnHistoricalUpload" ||
      eventName === "onTurnOffHistoricalUpload"
    ) {
      dispatch(
        healthStateSet({
          turnOffUploaderReason: TPNativeHealth.turnOffUploaderReason,
          turnOffUploaderError: TPNativeHealth.turnOffUploaderError,
          isHistoricalUploadPending:
            TPNativeHealth.isHistoricalUploadPending,
          isUploadingHistorical: TPNativeHealth.isUploadingHistorical,
          historicalUploadCurrentDay: TPNativeHealth.historicalUploadCurrentDay,
          historicalUploadTotalDays: TPNativeHealth.historicalUploadTotalDays,
        })
      );
    } else if (eventName === "onUploadStatsUpdated") {
      if (uploaderType === "historical") {
        // If we get a stats updated event for historical upload, we might have
        // missed onTurnOnHistoricalUpload if it were sent before RN
        // initialized, so, dispatch uploaderStateSet as well
        dispatch(
          healthStateSet({
            turnOffUploaderReason: TPNativeHealth.turnOffUploaderReason,
            turnOffUploaderError: TPNativeHealth.turnOffUploaderError,
            isHistoricalUploadPending:
              TPNativeHealth.isHistoricalUploadPending,
            isUploadingHistorical: TPNativeHealth.isUploadingHistorical,
            historicalUploadCurrentDay:
              TPNativeHealth.historicalUploadCurrentDay,
            historicalUploadTotalDays: TPNativeHealth.historicalUploadTotalDays,
          })
        );
      } else if (uploaderType === "current") {
        dispatch(
          healthStateSet({
            lastCurrentUploadUiDescription:
              TPNativeHealth.lastCurrentUploadUiDescription,
          })
        );
      }
    }
  };

  onBackPress = () => {
    const { dispatch, navigation } = this.props;
    const { routeName } = getRouteName({ navigation });
    if (routeName === HOME_ROUTE_NAME || routeName === SIGN_IN_ROUTE_NAME) {
      return false;
    }
    dispatch(NavigationActions.back());
    return true;
  };

  onAppStateChange = nextAppState => {
    const { dispatch } = this.props;

    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      dispatch(authRefreshToken);
    }
    this.setState({ appState: nextAppState });
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
