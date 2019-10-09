import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { BackHandler, UIManager } from "react-native";
import { NavigationActions } from "react-navigation";
import { connect } from "react-redux";

import { AppNavigator } from "../navigators/AppNavigator";
import { HOME_ROUTE_NAME, SIGN_IN_ROUTE_NAME } from "../navigators/routeNames";
import getRouteName from "../navigators/getRouteName";
import { TPNativeHealth } from "../models/TPNativeHealth";
import {
  shouldShowHealthKitUISet,
  healthKitInterfaceEnabledForCurrentUserSet,
  healthKitInterfaceConfiguredForOtherUserSet,
  isUploadingHistoricalSet,
} from "../actions/health";
// import { Logger } from "../models/Logger";

class AppWithNavigationState extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;

    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
    TPNativeHealth.addListener(this.onHealthEvent);

    // Do initial dispatch of health state when mounting. Further updates are by way of TPNativeHealth events
    dispatch(shouldShowHealthKitUISet(TPNativeHealth.shouldShowHealthKitUI));
    dispatch(
      healthKitInterfaceEnabledForCurrentUserSet(
        TPNativeHealth.healthKitInterfaceEnabledForCurrentUser
      )
    );
    dispatch(
      healthKitInterfaceConfiguredForOtherUserSet(
        TPNativeHealth.healthKitInterfaceConfiguredForOtherUser
      )
    );
    dispatch(
      isUploadingHistoricalSet({
        turnOffUploaderReason: TPNativeHealth.turnOffUploaderReason,
        turnOffUploaderError: TPNativeHealth.turnOffUploaderError,
        isUploadingHistorical: TPNativeHealth.isUploadingHistorical,
        historicalUploadCurrentDay: TPNativeHealth.historicalUploadCurrentDay,
        historicalTotalDays: TPNativeHealth.historicalTotalDays,
        historicalTotalUploadCount: TPNativeHealth.historicalTotalUploadCount,
      })
    );
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
    TPNativeHealth.removeListener(this.onHealthEvent);
  }

  onHealthEvent = (eventName, eventParams) => {
    const { dispatch } = this.props;

    if (
      eventName === "onTurnOnInterface" ||
      eventName === "onTurnOffInterface"
    ) {
      dispatch(
        healthKitInterfaceEnabledForCurrentUserSet(
          TPNativeHealth.healthKitInterfaceEnabledForCurrentUser
        )
      );
      dispatch(
        healthKitInterfaceConfiguredForOtherUserSet(
          TPNativeHealth.healthKitInterfaceConfiguredForOtherUser
        )
      );
    } else if (
      eventName === "onTurnOnHistoricalUpload" ||
      eventName === "onTurnOffHistoricalUpload"
    ) {
      dispatch(
        isUploadingHistoricalSet({
          turnOffUploaderReason: TPNativeHealth.turnOffUploaderReason,
          turnOffUploaderError: TPNativeHealth.turnOffUploaderError,
          isUploadingHistorical: TPNativeHealth.isUploadingHistorical,
          historicalUploadCurrentDay: TPNativeHealth.historicalUploadCurrentDay,
          historicalTotalDays: TPNativeHealth.historicalTotalDays,
          historicalTotalUploadCount: TPNativeHealth.historicalTotalUploadCount,
        })
      );
    } else if (eventName === "onUploadStatsUpdated") {
      if (eventParams.type === "historical") {
        // If we get an stats updated event for historical upload, we might have
        // missed onTurnOnHistoricalUpload if it were sent before RN
        // initialized, so, dispatch isUploadingHistoricalSet as well
        if (TPNativeHealth.isUploadingHistorical) {
          dispatch(
            isUploadingHistoricalSet({
              isUploadingHistorical: TPNativeHealth.isUploadingHistorical,
              historicalUploadCurrentDay:
                TPNativeHealth.historicalUploadCurrentDay,
              historicalTotalDays: TPNativeHealth.historicalTotalDays,
              historicalTotalUploadCount:
                TPNativeHealth.historicalTotalUploadCount,
            })
          );
        }
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
