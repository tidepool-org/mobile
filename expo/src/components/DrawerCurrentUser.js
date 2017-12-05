import React, { Component } from "react";
import PropTypes from "prop-types";
import { ViewPropTypes } from "react-native";
import glamorous, { withTheme } from "glamorous-native";

import ThemePropTypes from "../themes/ThemePropTypes";

// TODO: redux - need to remove hardcoded user fullname ("Current User") and use proper app state from redux

class DrawerCurrentUser extends Component {
  onPress = () => {
    // TODO: switch profile when selecting current user from drawer and closing drawer
    this.props.navigation.navigate("DrawerClose");
  };

  render() {
    const { theme, style } = this.props;

    return (
      <glamorous.TouchableWithoutFeedback onPress={this.onPress}>
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
            numberOfLines={1}
            style={theme.drawerMenuCurrentUserTextStyle}
          >
            Current User
          </glamorous.Text>
        </glamorous.View>
      </glamorous.TouchableWithoutFeedback>
    );
  }
}

DrawerCurrentUser.propTypes = {
  theme: ThemePropTypes.isRequired,
  style: ViewPropTypes.style,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
  }).isRequired,
};

DrawerCurrentUser.defaultProps = {
  style: null,
};

export default withTheme(DrawerCurrentUser);
