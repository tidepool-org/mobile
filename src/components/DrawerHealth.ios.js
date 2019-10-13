import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { ViewPropTypes, Switch } from "react-native";
import glamorous, { withTheme } from "glamorous-native";

import Colors from "../constants/Colors";
import { Metrics } from "../models/Metrics";
import { TPNativeHealth } from "../models/TPNativeHealth";
import { ThemePropType } from "../prop-types/theme";

class DrawerHealth extends PureComponent {
  state = {
    connectToHealthUserSetting: null,
  };

  componentWillReceiveProps(nextProps) {
    const {
      health: { healthKitInterfaceEnabledForCurrentUser },
    } = this.props;
    if (
      healthKitInterfaceEnabledForCurrentUser !==
      nextProps.health.healthKitInterfaceEnabledForCurrentUser
    ) {
      this.setState({
        connectToHealthUserSetting:
          nextProps.health.healthKitInterfaceEnabledForCurrentUser,
      });
    }
  }

  onConnectToHealthValueChange = value => {
    if (value) {
      TPNativeHealth.enableHealthKitInterface();
      Metrics.track({ metric: "Connect to health on" });
    } else {
      TPNativeHealth.disableHealthKitInterface();
      Metrics.track({ metric: "Connect to health off" });
    }
    this.setState({ connectToHealthUserSetting: value });
  };

  render() {
    const { connectToHealthUserSetting } = this.state;
    const {
      health: {
        shouldShowHealthKitUI,
        healthKitInterfaceEnabledForCurrentUser,
      },
    } = this.props;

    if (!shouldShowHealthKitUI) {
      return null;
    }

    const { theme, style } = this.props;

    return (
      <glamorous.View style={style} height={80}>
        <glamorous.View flexDirection="row" alignItems="center" marginLeft={16}>
          <glamorous.Text
            allowFontScaling={false}
            style={theme.drawerMenuConnectToHealthTextStyle}
            marginRight={8}
          >
            Connect to Health
          </glamorous.Text>
          <Switch
            style={{ transform: [{ scaleX: 0.75 }, { scaleY: 0.75 }] }}
            trackColor={{ true: Colors.brightBlue, false: null }}
            onValueChange={this.onConnectToHealthValueChange}
            value={
              connectToHealthUserSetting !== null
                ? connectToHealthUserSetting
                : healthKitInterfaceEnabledForCurrentUser
            }
          />
        </glamorous.View>
      </glamorous.View>
    );
  }
}

DrawerHealth.propTypes = {
  theme: ThemePropType.isRequired,
  style: ViewPropTypes.style,
  health: PropTypes.object.isRequired,
};

DrawerHealth.defaultProps = {
  style: null,
};

export default withTheme(DrawerHealth);
