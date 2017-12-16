import React, { PureComponent } from "react";
import { ViewPropTypes, Switch } from "react-native";
import glamorous, { withTheme } from "glamorous-native";

import Colors from "../constants/Colors";
import ThemePropTypes from "../themes/ThemePropTypes";

class DrawerHealth extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      connectToHealth: false,
    };
  }

  onConnectToHealthValueChange = value => {
    this.setState({ connectToHealth: value });
  };

  render() {
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
            onTintColor={Colors.brightBlue}
            onValueChange={this.onConnectToHealthValueChange}
            value={this.state.connectToHealth}
          />
        </glamorous.View>
      </glamorous.View>
    );
  }
}

DrawerHealth.propTypes = {
  theme: ThemePropTypes.isRequired,
  style: ViewPropTypes.style,
};

DrawerHealth.defaultProps = {
  style: null,
};

export default withTheme(DrawerHealth);
