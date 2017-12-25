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
    this.props.onPress(this.props.item);
  };

  renderCurrentUserProfileIcon() {
    const { item: { currentUserId, userId } } = this.props;

    if (currentUserId === userId) {
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
    const { theme, item: { currentUserId, userId, fullName } } = this.props;
    const titleColor = this.state.isUnderlayVisible
      ? theme.titleColorActive
      : theme.listItemName.color;

    return (
      <glamorous.Text
        style={theme.listItemName}
        flex={1}
        allowFontScaling={false}
        numberOfLines={1}
        color={titleColor}
      >
        {currentUserId === userId ? "(You) " : null}
        {fullName}
      </glamorous.Text>
    );
  }

  renderSelectedCheckMark() {
    const { theme, item: { selectedProfileUserId, userId } } = this.props;
    const borderColor = this.state.isUnderlayVisible
      ? theme.titleColorActive
      : theme.underlayColor;

    if (selectedProfileUserId === userId) {
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
          {this.renderSelectedCheckMark()}
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
    userId: PropTypes.string.isRequired,
    fullName: PropTypes.string.isRequired,
  }).isRequired,
  onPress: PropTypes.func.isRequired,
};

ProfileListItem.defaultProps = {
  style: null,
};

export default withTheme(ProfileListItem);
