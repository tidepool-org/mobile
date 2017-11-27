import React, { Component } from "react";
import { ViewPropTypes } from "react-native";
import glamorous, { withTheme } from "glamorous-native";

import ThemePropTypes from "../themes/ThemePropTypes";

// TODO: redux - need to remove hardcoded user fullname ("Current User") and use proper app state from redux
// TODO: drawer - need to handle tap on current user view to switch profile for notes to current user

class DrawerCurrentUser extends Component {
  render() {
    const { theme, style } = this.props;

    return (
      <glamorous.View
        style={style}
        flexDirection="row"
        alignItems="center"
        height={54}
      >
        <glamorous.Image
          source={require("../../assets/images/profile-blue.png")}
          width={24}
          height={24}
          marginLeft={16}
          marginRight={10}
        />
        <glamorous.Text
          allowFontScaling={false}
          style={theme.drawerMenuCurrentUserTextStyle}
        >
          Current User
        </glamorous.Text>
      </glamorous.View>
    );
  }
}

DrawerCurrentUser.propTypes = {
  theme: ThemePropTypes.isRequired,
  style: ViewPropTypes.style,
};

DrawerCurrentUser.defaultProps = {
  style: null,
};

export default withTheme(DrawerCurrentUser);
