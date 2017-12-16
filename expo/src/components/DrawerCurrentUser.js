import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { ViewPropTypes } from "react-native";
import glamorous, { withTheme } from "glamorous-native";

import ThemePropTypes from "../themes/ThemePropTypes";

class DrawerCurrentUser extends PureComponent {
  onPress = () => {
    // TODO: profile - switch profile when selecting current user from drawer and closing drawer
    this.props.navigateDrawerClose();
  };

  render() {
    const { theme, style, currentUser: { fullName } } = this.props;

    return (
      <glamorous.TouchableOpacity activeOpacity={1} onPress={this.onPress}>
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
            {fullName}
          </glamorous.Text>
        </glamorous.View>
      </glamorous.TouchableOpacity>
    );
  }
}

DrawerCurrentUser.propTypes = {
  theme: ThemePropTypes.isRequired,
  style: ViewPropTypes.style,
  navigateDrawerClose: PropTypes.func.isRequired,
  currentUser: PropTypes.shape({
    fullName: PropTypes.string.isRequired,
  }).isRequired,
};

DrawerCurrentUser.defaultProps = {
  style: null,
};

export default withTheme(DrawerCurrentUser);
