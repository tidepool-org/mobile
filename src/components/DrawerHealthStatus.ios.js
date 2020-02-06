import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { ViewPropTypes } from "react-native";
import glamorous, { withTheme } from "glamorous-native";

import { ThemePropType } from "../prop-types/theme";
import { TPNativeHealth } from "../models/TPNativeHealth";

class DrawerHealthStatus extends PureComponent {
  componentDidMount() {
    this.refreshUploadStatsInterval = setInterval(() => {
      TPNativeHealth.refreshUploadStats();
    }, 1000 * 30); // 30 seconds
  }

  componentWillUnmount() {
    clearInterval(this.refreshUploadStatsInterval);
  }

  renderHealthExplanation() {
    const { theme } = this.props;
    const explanation =
      "Allow Tidepool Mobile to read diabetes-related data from Apple Health";

    return (
      <glamorous.View flexDirection="row" marginLeft={16}>
        <glamorous.Text
          allowFontScaling={false}
          style={theme.healthMinorStatus}
          marginRight={8}
        >
          {explanation}
        </glamorous.Text>
      </glamorous.View>
    );
  }

  renderStatus() {
    const {
      theme,
      health: {
        isUploadingHistorical,
        historicalUploadCurrentDay,
        historicalUploadTotalDays,
        lastCurrentUploadUiDescription,
        isInterfaceOn,
        isTurningInterfaceOn,
        interfaceTurnedOffError,
      },
      isOffline,
    } = this.props;

    let line1Text = "";
    let line2Text = "";

    if (isOffline) {
      line1Text =
        "Unable to upload. The Internet connection appears to be offline.";
    } else if (isUploadingHistorical) {
      // TODO: health -  Revisit this temporary work around for an issue where
      // upload stats show 1 of 1 days before determining true total number of
      // days!
      line1Text = "Syncing Health data…";
      if (historicalUploadTotalDays > 1) {
        line2Text = `Day ${historicalUploadCurrentDay} of ${historicalUploadTotalDays}`;
      }
    } else if (isInterfaceOn) {
      line1Text = lastCurrentUploadUiDescription;
    } else if (isTurningInterfaceOn) {
      line1Text = "Preparing to upload...";
    } else {
      line1Text = interfaceTurnedOffError;
    }

    return (
      <glamorous.View flexDirection="column" marginLeft={16}>
        <glamorous.Text
          allowFontScaling={false}
          style={theme.healthMinorStatus}
        >
          {line1Text}
        </glamorous.Text>
        <glamorous.Text
          allowFontScaling={false}
          style={theme.healthMinorStatus}
        >
          {line2Text}
        </glamorous.Text>
      </glamorous.View>
    );
  }

  render() {
    const {
      health: { isHealthKitInterfaceEnabledForCurrentUser },
      style,
    } = this.props;

    return (
      <glamorous.View style={style}>
        {isHealthKitInterfaceEnabledForCurrentUser
          ? this.renderStatus()
          : this.renderHealthExplanation()}
      </glamorous.View>
    );
  }
}

DrawerHealthStatus.propTypes = {
  theme: ThemePropType.isRequired,
  style: ViewPropTypes.style,
  health: PropTypes.object.isRequired,
  isOffline: PropTypes.bool,
};

DrawerHealthStatus.defaultProps = {
  style: null,
  isOffline: false,
};

export default withTheme(DrawerHealthStatus);
