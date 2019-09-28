import React, { PureComponent } from "react";
import { ViewPropTypes, Switch, NativeModules } from "react-native";
import glamorous, { withTheme } from "glamorous-native";
import Constants from "expo-constants";

import Colors from "../constants/Colors";
import Metrics from "../models/Metrics";
import { ThemePropType } from "../prop-types/theme";

class DrawerHealth extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      connectToHealth: false,
      shouldShowHealthKitUI: false,
    };
  }

  componentDidMount() {
    if (Constants.appOwnership === "expo") {
      this.setState({ shouldShowHealthKitUI: true });
    } else {
      try {
        const { TPNative } = NativeModules;
        const shouldShowHealthKitUI = TPNative.shouldShowHealthKitUI();
        this.setState({ shouldShowHealthKitUI });
      } catch (error) {
        // console.log(`error: ${error}`);
      }
    }
  }

  onConnectToHealthValueChange = value => {
    if (value) {
      try {
        const { TPNative } = NativeModules;
        TPNative.enableHealthKitInterface();
      } catch (error) {
        // console.log(`error: ${error}`);
      }

      Metrics.track({ metric: "Connect to health on" });
    } else {
      try {
        const { TPNative } = NativeModules;
        TPNative.disableHealthKitInterface();
      } catch (error) {
        // console.log(`error: ${error}`);
      }

      Metrics.track({ metric: "Connect to health off" });
    }
    this.setState({ connectToHealth: value });
  };

  render() {
    const { connectToHealth, shouldShowHealthKitUI } = this.state;

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
            value={connectToHealth}
          />
        </glamorous.View>
      </glamorous.View>
    );
  }
}

DrawerHealth.propTypes = {
  theme: ThemePropType.isRequired,
  style: ViewPropTypes.style,
};

DrawerHealth.defaultProps = {
  style: null,
};

export default withTheme(DrawerHealth);
