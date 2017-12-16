import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { ViewPropTypes } from "react-native";
import glamorous, { withTheme } from "glamorous-native";

import ThemePropTypes from "../themes/ThemePropTypes";

class ProfileListItem extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isUnderlayVisible: false,
    };
  }

  onPress = () => {
    const { item: { profile } } = this.props;
    this.props.onPress(profile.userid);
  };
  theme;
  renderCurrentUserProfileIcon() {
    const { item: { profile }, item: { currentUserId } } = this.props;

    if (currentUserId === profile.userid) {
      return (
        <glamorous.Image
          source={require("../../assets/images/profile-black.png")}
          width={24}
          height={24}
          marginRight={6}
        />
      );
    }

    return null;
  }

  renderName() {
    const { theme, item: { profile }, item: { currentUserId } } = this.props;
    const titleColor = this.state.isUnderlayVisible
      ? theme.titleColorActive
      : theme.profileListItemName.color;

    return (
      <glamorous.Text
        style={theme.profileListItemName}
        flex={1}
        allowFontScaling={false}
        numberOfLines={1}
        color={titleColor}
      >
        {currentUserId === profile.userid ? "(You) " : null}
        {profile.fullname}
      </glamorous.Text>
    );
  }

  renderSelectedProfileCheckMark() {
    const {
      theme,
      item: { profile },
      item: { selectedProfileUserId },
    } = this.props;
    const borderColor = this.state.isUnderlayVisible
      ? theme.titleColorActive
      : theme.underlayColor;

    if (selectedProfileUserId === profile.userid) {
      return (
        <glamorous.View
          width={13}
          height={6}
          marginLeft={12}
          alignSelf="center"
          backgroundColor="transparent"
          borderBottomWidth={2}
          borderLeftWidth={2}
          borderColor={borderColor}
          transform={[
            {
              rotate: "-45deg",
            },
          ]}
        />
      );
    }

    return null;
  }

  render() {
    const { style, theme } = this.props;

    return (
      <glamorous.TouchableHighlight
        onPress={this.onPress}
        underlayColor={theme.underlayColor}
        onShowUnderlay={() => {
          this.setState({ isUnderlayVisible: true });
        }}
        onHideUnderlay={() => {
          this.setState({ isUnderlayVisible: false });
        }}
      >
        <glamorous.View
          style={style}
          padding={8}
          paddingLeft={16}
          flexDirection="row"
          justifyContent="space-between"
        >
          {this.renderCurrentUserProfileIcon()}
          {this.renderName()}
          {this.renderSelectedProfileCheckMark()}
        </glamorous.View>
      </glamorous.TouchableHighlight>
    );
  }
}

ProfileListItem.propTypes = {
  theme: ThemePropTypes.isRequired,
  style: ViewPropTypes.style,
  item: PropTypes.shape({
    currentUserId: PropTypes.string.isRequired,
    selectedProfileUserId: PropTypes.string.isRequired,
    profile: PropTypes.shape({
      userid: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  onPress: PropTypes.func.isRequired,
};

ProfileListItem.defaultProps = {
  style: null,
};

export default withTheme(ProfileListItem);
