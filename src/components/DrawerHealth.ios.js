import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Alert, Switch, ViewPropTypes } from "react-native";
import glamorous, { withTheme } from "glamorous-native";

import Colors from "../constants/Colors";
import DrawerHealthStatus from "./DrawerHealthStatus";
import { Metrics } from "../models/Metrics";
import { TPNativeHealth } from "../models/TPNativeHealth";
import { ThemePropType } from "../prop-types/theme";

class DrawerHealth extends PureComponent {
  state = {
    connectToHealthUserSetting: null,
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
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

  onPressCancelChangeToOtherUser = () => {
    this.setState({ connectToHealthUserSetting: false });
  };

  onPressChangeToOtherUser = () => {
    TPNativeHealth.enableHealthKitInterface();
  };

  onConnectToHealthValueChange = value => {
    if (value) {
      this.enableHealthKitInterfaceForCurrentUser();
      Metrics.track({ metric: "Connect to health on" });
    } else {
      TPNativeHealth.disableHealthKitInterface();
      Metrics.track({ metric: "Connect to health off" });
    }
    this.setState({ connectToHealthUserSetting: value });
  };

  enableHealthKitInterfaceForCurrentUser() {
    const {
      health: {
        healthKitInterfaceConfiguredForOtherUser,
        currentHealthKitUsername,
      },
    } = this.props;

    if (healthKitInterfaceConfiguredForOtherUser) {
      const username = currentHealthKitUsername || "Unknown";
      const message = `A different account (${username}) is currently associated with Health Data on this device`;
      Alert.alert("Are you sure?", message, [
        {
          text: "Cancel",
          style: "cancel",
          onPress: this.onPressCancelChangeToOtherUser,
        },
        {
          text: "Change",
          onPress: this.onPressChangeToOtherUser,
        },
      ]);
    } else {
      TPNativeHealth.enableHealthKitInterface();
    }
  }

  render() {
    const { connectToHealthUserSetting } = this.state;
    const {
      health,
      health: {
        shouldShowHealthKitUI,
        healthKitInterfaceEnabledForCurrentUser,
      },
    } = this.props;

    if (!shouldShowHealthKitUI) {
      return null;
    }

    const { theme, style } = this.props;
    const connectToHealthSwitchValue =
      connectToHealthUserSetting !== null
        ? connectToHealthUserSetting
        : healthKitInterfaceEnabledForCurrentUser;

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
            value={connectToHealthSwitchValue}
          />
        </glamorous.View>
        <DrawerHealthStatus
          health={health}
          style={style}
          connectToHealthUserSetting={connectToHealthSwitchValue}
        />
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
