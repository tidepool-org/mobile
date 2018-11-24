import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { ViewPropTypes, Switch } from "react-native";
import glamorous, { withTheme } from "glamorous-native";

import Colors from "../constants/Colors";
import Metrics from "../models/Metrics";
import { ThemePropType } from "../prop-types/theme";

class DrawerHealth extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      connectToHealth: false,
    };
  }

  onConnectToHealthValueChange = value => {
    if (value) {
      Metrics.track({ metric: "Connect to health on" });
    } else {
      Metrics.track({ metric: "Connect to health off" });
    }
    this.setState({ connectToHealth: value });
  };

  render() {
    const { theme, style, currentUser } = this.props;
    const { connectToHealth } = this.state;

    if (!currentUser.patient) {
      return null;
    }

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
            onTintColor={Colors.brightBlue}
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
  currentUser: PropTypes.object.isRequired,
};

DrawerHealth.defaultProps = {
  style: null,
};

export default withTheme(DrawerHealth);
