import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { ViewPropTypes } from "react-native";
import glamorous, { withTheme } from "glamorous-native";

import { ThemePropType } from "../prop-types/theme";
import { UserPropType } from "../prop-types/user";

class DrawerCurrentUser extends PureComponent {
  onPress = () => {
    const {
      currentUser,
      notesSwitchProfileAndFetchAsync,
      navigateDrawerClose,
    } = this.props;
    notesSwitchProfileAndFetchAsync({
      authUser: currentUser,
      profile: currentUser,
    });
    navigateDrawerClose();
  };

  render() {
    const {
      theme,
      style,
      currentUser: { fullName },
    } = this.props;

    return (
      <glamorous.TouchableOpacity onPress={this.onPress}>
        <glamorous.View
          style={style}
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
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
            flex={1}
            allowFontScaling={false}
            numberOfLines={1}
            style={theme.drawerMenuCurrentUserTextStyle}
          >
            {fullName}
          </glamorous.Text>
          <glamorous.View width={10} height={10} />
        </glamorous.View>
      </glamorous.TouchableOpacity>
    );
  }
}

DrawerCurrentUser.propTypes = {
  theme: ThemePropType.isRequired,
  style: ViewPropTypes.style,
  currentUser: UserPropType.isRequired,
  navigateDrawerClose: PropTypes.func.isRequired,
  notesSwitchProfileAndFetchAsync: PropTypes.func.isRequired,
};

DrawerCurrentUser.defaultProps = {
  style: null,
};

export default withTheme(DrawerCurrentUser);
