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
        isHistoricalUploadPending,
        isUploadingHistoricalRetry,
        historicalTotalSamplesCount,
        historicalUploadTotalSamples,
        historicalUploadCurrentDay,
        historicalTotalDaysCount,
        lastCurrentUploadUiDescription,
        isInterfaceOn,
        isTurningInterfaceOn,
        interfaceTurnedOffError,
      },
      isOffline,
    } = this.props;

    let line1Text = "";
    let line2Text = "";
    const useDaysProgress = false;

    if (isTurningInterfaceOn || isHistoricalUploadPending) {
      line1Text = "Preparing to upload";
    } else if (isOffline) {
      line1Text = "Upload paused while offline.";
    } else if (isTurningInterfaceOn || isHistoricalUploadPending) {
      line1Text = "Preparing to upload";
    } else if (isUploadingHistorical) {
      line1Text = "Syncing Now";
    } else if (isUploadingHistoricalRetry) {
      line1Text = "Retrying upload";
    } else if (isInterfaceOn) {
      line1Text = lastCurrentUploadUiDescription;
    } else {
      line1Text = interfaceTurnedOffError;
    }

    if (isUploadingHistorical && historicalUploadTotalSamples) {
      if (useDaysProgress) {
        line2Text = `Day ${historicalUploadCurrentDay.toLocaleString()} of ${historicalTotalDaysCount.toLocaleString()}`;
      } else {
        line2Text = `Uploaded ${new Intl.NumberFormat(undefined, { style: 'percent'}).format(historicalUploadTotalSamples / historicalTotalSamplesCount)}`;
      }
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
