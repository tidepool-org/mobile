import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { AppState, BackHandler, UIManager } from "react-native";
import { NavigationActions } from "react-navigation";
import { connect } from "react-redux";

import { AppNavigator } from "../navigators/AppNavigator";
import { HOME_ROUTE_NAME, SIGN_IN_ROUTE_NAME } from "../navigators/routeNames";
import getRouteName from "../navigators/getRouteName";
import { TPNative } from "../models/TPNative";
import { TPNativeHealth } from "../models/TPNativeHealth";
import { healthStateSet } from "../actions/health";
import { ConnectionStatus } from "../models/ConnectionStatus";
import { navigateDebugSettings } from "../actions/navigation";
import { authRefreshToken } from "../actions/auth";
import { offlineSet } from "../actions/offline";
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
    ConnectionStatus.addListener(this.onConnectionStatusChange);
    TPNative.addListener(this.onNativeEvent);
    TPNativeHealth.addListener(this.onNativeHealthEvent);
    TPNativeHealth.refreshUploadStats();

    // Do initial dispatch of health state when mounting. Further updates are by way of TPNativeHealth events
    dispatch(
      healthStateSet({
        ...TPNativeHealth.healthKitInterfaceConfiguration,

        isUploadingHistorical: TPNativeHealth.isUploadingHistorical,
        isHistoricalUploadPending: TPNativeHealth.isHistoricalUploadPending,
        isUploadingHistoricalRetry: TPNativeHealth.isUploadingHistoricalRetry,
        historicalUploadLimitsIndex: TPNativeHealth.historicalUploadLimitsIndex,
        historicalUploadMaxLimitsIndex: TPNativeHealth.historicalUploadMaxLimitsIndex,
        historicalUploadCurrentDay: TPNativeHealth.historicalUploadCurrentDay,
        historicalTotalDaysCount: TPNativeHealth.historicalTotalDaysCount,
        historicalTotalSamplesCount: TPNativeHealth.historicalTotalSamplesCount,
        historicalUploadTotalSamples: TPNativeHealth.historicalUploadTotalSamples,
        historicalUploadTotalDeletes: TPNativeHealth.historicalUploadTotalDeletes,
        turnOffHistoricalUploaderReason: TPNativeHealth.turnOffHistoricalUploaderReason,
        turnOffHistoricalUploaderError: TPNativeHealth.turnOffHistoricalUploaderError,

        isUploadingCurrent: TPNativeHealth.isUploadingCurrent,
        isUploadingCurrentRetry: TPNativeHealth.isUploadingCurrentRetry,
        currentUploadLimitsIndex: TPNativeHealth.currentUploadLimitsIndex,
        currentUploadMaxLimitsIndex: TPNativeHealth.currentUploadMaxLimitsIndex,
        currentUploadTotalSamples: TPNativeHealth.currentUploadTotalSamples,
        currentUploadTotalDeletes: TPNativeHealth.currentUploadTotalDeletes,
        turnOffCurrentUploaderReason: TPNativeHealth.turnOffCurrentUploaderReason,
        turnOffCurrentUploaderError: TPNativeHealth.turnOffCurrentUploaderError,
        lastCurrentUploadUiDescription: TPNativeHealth.lastCurrentUploadUiDescription,
      })
    );
  }

  componentWillUnmount() {
    AppState.removeEventListener("change", this.onAppStateChange);
    BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
    TPNative.removeListener(this.onNativeEvent);
    TPNativeHealth.removeListener(this.onNativeHealthEvent);
  }

  onConnectionStatusChange = () => {
    const { dispatch } = this.props;
    dispatch(offlineSet(ConnectionStatus.isOffline));
  }

  onNativeEvent = eventName => {
    const { dispatch } = this.props;
    if (eventName === "onShareDidEndPreview") {
      dispatch(navigateDebugSettings());
    }
  };

  onNativeHealthEvent = (eventName, uploaderType) => {
    const { dispatch } = this.props;

    if (eventName === "onHealthKitInterfaceConfiguration") {
      dispatch(
        healthStateSet({
          ...TPNativeHealth.healthKitInterfaceConfiguration,

          isUploadingHistorical: TPNativeHealth.isUploadingHistorical,
          isHistoricalUploadPending: TPNativeHealth.isHistoricalUploadPending,
          historicalUploadCurrentDay: TPNativeHealth.historicalUploadCurrentDay,
          historicalTotalDaysCount: TPNativeHealth.historicalTotalDaysCount,
          historicalTotalSamplesCount: TPNativeHealth.historicalTotalSamplesCount,
          historicalUploadTotalSamples: TPNativeHealth.historicalUploadTotalSamples,
          historicalUploadTotalDeletes: TPNativeHealth.historicalUploadTotalDeletes,
          turnOffHistoricalUploaderReason: TPNativeHealth.turnOffHistoricalUploaderReason,
          turnOffHistoricalUploaderError: TPNativeHealth.turnOffHistoricalUploaderError,

          isUploadingCurrent: TPNativeHealth.isUploadingCurrent,
          currentUploadTotalSamples: TPNativeHealth.currentUploadTotalSamples,
          currentUploadTotalDeletes: TPNativeHealth.currentUploadTotalDeletes,
          turnOffCurrentUploaderReason: TPNativeHealth.turnOffCurrentUploaderReason,
          turnOffCurrentUploaderError: TPNativeHealth.turnOffCurrentUploaderError,
          lastCurrentUploadUiDescription: TPNativeHealth.lastCurrentUploadUiDescription,
        })
      );
    } else if (
      eventName === "onTurnOnUploader" ||
      eventName === "onTurnOffUploader"
    ) {
      if (uploaderType === "historical") {
          dispatch(
          healthStateSet({
            isUploadingHistorical: TPNativeHealth.isUploadingHistorical,
            isHistoricalUploadPending: TPNativeHealth.isHistoricalUploadPending,
            isUploadingHistoricalRetry: TPNativeHealth.isUploadingHistoricalRetry,
            historicalUploadLimitsIndex: TPNativeHealth.historicalUploadLimitsIndex,
            historicalUploadMaxLimitsIndex: TPNativeHealth.historicalUploadMaxLimitsIndex,
            historicalUploadCurrentDay: TPNativeHealth.historicalUploadCurrentDay,
            historicalTotalDaysCount: TPNativeHealth.historicalTotalDaysCount,
            historicalTotalSamplesCount: TPNativeHealth.historicalTotalSamplesCount,
            historicalUploadTotalSamples: TPNativeHealth.historicalUploadTotalSamples,
            historicalUploadTotalDeletes: TPNativeHealth.historicalUploadTotalDeletes,
            turnOffHistoricalUploaderReason: TPNativeHealth.turnOffHistoricalUploaderReason,
            turnOffHistoricalUploaderError: TPNativeHealth.turnOffHistoricalUploaderError,
          })
        );
      } else {
        dispatch(
          healthStateSet({
            isUploadingCurrent: TPNativeHealth.isUploadingCurrent,
            isUploadingCurrentRetry: TPNativeHealth.isUploadingCurrentRetry,
            currentUploadLimitsIndex: TPNativeHealth.currentUploadLimitsIndex,
            currentUploadMaxLimitsIndex: TPNativeHealth.currentUploadMaxLimitsIndex,
            currentUploadTotalSamples: TPNativeHealth.currentUploadTotalSamples,
            currentUploadTotalDeletes: TPNativeHealth.currentUploadTotalDeletes,
            turnOffCurrentUploaderReason: TPNativeHealth.turnOffCurrentUploaderReason,
            turnOffUploaderCurrentError: TPNativeHealth.turnOffUploaderCurrentError,
          })
        );
      }
    } else if (eventName === "onRetryUpload") {
      if (uploaderType === "historical") {
        dispatch(
          healthStateSet({
            isUploadingHistoricalRetry: TPNativeHealth.isUploadingHistoricalRetry,
            historicalUploadLimitsIndex: TPNativeHealth.historicalUploadLimitsIndex,
            historicalUploadMaxLimitsIndex: TPNativeHealth.historicalUploadMaxLimitsIndex,
            retryHistoricalUploadReason: TPNativeHealth.retryHistoricalUploadReason,
            retryHistoricalUploadError: TPNativeHealth.retryHistoricalUploadError,
          })
        );
      } else {
        dispatch(
          healthStateSet({
            isUploadingCurrent: TPNativeHealth.isUploadingCurrent,
            isUploadingCurrentRetry: TPNativeHealth.isUploadingCurrentRetry,
            currentUploadLimitsIndex: TPNativeHealth.currentUploadLimitsIndex,
            currentUploadMaxLimitsIndex: TPNativeHealth.currentUploadMaxLimitsIndex,
            retryCurrentUploadReason: TPNativeHealth.retryCurrentUploadReason,
            retryCurrentUploadError: TPNativeHealth.retryCurrentUploadError,
          })
        );
      }
    } else if (eventName === "onUploadHistoricalPending") {
      dispatch(
        healthStateSet({
          isHistoricalUploadPending: TPNativeHealth.isHistoricalUploadPending,
          historicalEndAnchorTime: TPNativeHealth.historicalEndAnchorTime,
          historicalTotalDaysCount: TPNativeHealth.historicalTotalDaysCount,
          historicalTotalSamplesCount: TPNativeHealth.historicalTotalSamplesCount,
          turnOffHistoricalUploaderReason: TPNativeHealth.turnOffHistoricalUploaderReason,
          turnOffHistoricalUploaderError: TPNativeHealth.turnOffHistoricalUploaderError,
})
      );
    } else if (eventName === "onUploadStatsUpdated") {
      if (uploaderType === "historical") {
        // If we get a stats updated event we might have missed onTurnOnUploader
        // if it were sent before RN initialized, so, dispatch uploaderStateSet
        // as well
        dispatch(
          healthStateSet({
            isUploadingHistorical: TPNativeHealth.isUploadingHistorical,
            isHistoricalUploadPending: TPNativeHealth.isHistoricalUploadPending,
            historicalUploadLimitsIndex: TPNativeHealth.historicalUploadLimitsIndex,
            historicalUploadMaxLimitsIndex: TPNativeHealth.historicalUploadMaxLimitsIndex,
            historicalUploadCurrentDay: TPNativeHealth.historicalUploadCurrentDay,
            historicalTotalDaysCount: TPNativeHealth.historicalTotalDaysCount,
            historicalTotalSamplesCount: TPNativeHealth.historicalTotalSamplesCount,
            historicalUploadTotalSamples: TPNativeHealth.historicalUploadTotalSamples,
            historicalUploadTotalDeletes: TPNativeHealth.historicalUploadTotalDeletes,
            historicalUploadEarliestSampleTime: TPNativeHealth.historicalUploadEarliestSampleTime,
            historicalUploadLatestSampleTime: TPNativeHealth.historicalUploadLatestSampleTime,
            historicalEndAnchorTime: TPNativeHealth.historicalEndAnchorTime,
            turnOffHistoricalUploaderReason: TPNativeHealth.turnOffHistoricalUploaderReason,
            turnOffHistoricalUploaderError: TPNativeHealth.turnOffHistoricalUploaderError,
          })
        );
      } else {
        dispatch(
          healthStateSet({
            isUploadingCurrent: TPNativeHealth.isUploadingCurrent,
            currentUploadLimitsIndex: TPNativeHealth.currentUploadLimitsIndex,
            currentUploadMaxLimitsIndex: TPNativeHealth.currentUploadMaxLimitsIndex,
            currentUploadTotalSamples: TPNativeHealth.currentUploadTotalSamples,
            currentUploadTotalDeletes: TPNativeHealth.currentUploadTotalDeletes,
            currentUploadEarliestSampleTime: TPNativeHealth.currentUploadEarliestSampleTime,
            currentUploadLatestSampleTime: TPNativeHealth.currentUploadLatestSampleTime,
            currentStartAnchorTime: TPNativeHealth.currentStartAnchorTime,
            turnOffCurrentUploaderReason: TPNativeHealth.turnOffCurrentUploaderReason,
            turnOffCurrentUploaderError: TPNativeHealth.turnOffCurrentUploaderReason,
            lastCurrentUploadUiDescription: TPNativeHealth.lastCurrentUploadUiDescription,
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
