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
    return (
      <glamorous.View flexDirection="row" marginLeft={16}>
        <glamorous.Text
          allowFontScaling={false}
          style={theme.healthMinorStatus}
          marginRight={8}
        >
          Allow Tidepool Mobile to read diabetes-related data from Apple Health
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
        lastCurrentUploadUiDescription, // TODO: my - 0 - since this uses time ago, we probably need to update this state as well when the component mounts?
      },
    } = this.props;

    let line1Text = "";
    let line2Text = "";

    if (isUploadingHistorical) {
      // TODO: health -  Revisit this temporary work around for an issue where
      // upload stats show 1 of 1 days before determining true total number of
      // days!
      line1Text = "Syncing Health data…";
      if (historicalUploadTotalDays > 1) {
        line2Text = `Day ${historicalUploadCurrentDay} of ${historicalUploadTotalDays}`;
      }
    } else {
      line1Text = lastCurrentUploadUiDescription;
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
      health: { healthKitInterfaceEnabledForCurrentUser },
      style,
    } = this.props;

    return (
      <glamorous.View style={style}>
        {healthKitInterfaceEnabledForCurrentUser
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
};

DrawerHealthStatus.defaultProps = {
  style: null,
};

export default withTheme(DrawerHealthStatus);
