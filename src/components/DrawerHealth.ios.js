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

  // TODO: Revisit this after we upgrade eslint-config-airbnb
  /* eslint-disable react/sort-comp */
  UNSAFE_componentWillReceiveProps(nextProps) {
    const {
      health: { isHealthKitInterfaceEnabledForCurrentUser },
    } = this.props;
    if (
      isHealthKitInterfaceEnabledForCurrentUser !==
      nextProps.health.isHealthKitInterfaceEnabledForCurrentUser
    ) {
      this.setState({
        connectToHealthUserSetting:
          nextProps.health.isHealthKitInterfaceEnabledForCurrentUser,
      });
    }
  }
  /* eslint-enable react/sort-comp */

  onPressCancelChangeToOtherUser = () => {
    this.setState({ connectToHealthUserSetting: false });
  };

  onPressChangeToOtherUser = () => {
    TPNativeHealth.enableHealthKitInterfaceAndAuthorize();
  };

  onConnectToHealthValueChange = value => {
    if (value) {
      this.enableHealthKitInterfaceAndAuthorizeForCurrentUser();
      Metrics.track({ metric: "Connect to health on" });
    } else {
      TPNativeHealth.disableHealthKitInterface();
      Metrics.track({ metric: "Connect to health off" });
    }
    this.setState({ connectToHealthUserSetting: value });
  };

  enableHealthKitInterfaceAndAuthorizeForCurrentUser() {
    const {
      health: {
        isHealthKitInterfaceConfiguredForOtherUser,
        currentHealthKitUsername,
      },
    } = this.props;

    if (isHealthKitInterfaceConfiguredForOtherUser) {
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
      TPNativeHealth.enableHealthKitInterfaceAndAuthorize();
    }
  }

  render() {
    const { connectToHealthUserSetting } = this.state;
    const {
      health,
      health: {
        shouldShowHealthKitUI,
        isHealthKitInterfaceEnabledForCurrentUser,
      },
      isOffline,
    } = this.props;

    if (!shouldShowHealthKitUI) {
      return null;
    }

    const { theme, style } = this.props;
    const connectToHealthSwitchValue =
      connectToHealthUserSetting !== null
        ? connectToHealthUserSetting
        : isHealthKitInterfaceEnabledForCurrentUser;

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
          isOffline={isOffline}
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
  isOffline: PropTypes.bool,
};

DrawerHealth.defaultProps = {
  style: null,
  isOffline: false,
};

export default withTheme(DrawerHealth);
