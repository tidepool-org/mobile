import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import glamorous, { withTheme } from "glamorous-native";

import { ThemePropType } from "../prop-types/theme";

class DrawerButton extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isUnderlayVisible: false,
    };
  }

  renderTitle() {
    const { title, theme, hasDisclosureIndicator } = this.props;
    const titleColor = hasDisclosureIndicator
      ? theme.drawerMenuButtonStyle.titleColorBlue
      : theme.drawerMenuButtonStyle.titleColorGrey;

    return (
      <glamorous.Text
        allowFontScaling={false}
        style={theme.drawerMenuButtonStyle.titleFontStyle}
        marginLeft={15}
        marginRight={15}
        alignSelf="center"
        color={
          this.state.isUnderlayVisible ? theme.titleColorActive : titleColor
        }
      >
        {title}
      </glamorous.Text>
    );
  }

  renderSubtitle() {
    const { subtitle, hasDisclosureIndicator, theme } = this.props;
    const titleColor = hasDisclosureIndicator
      ? theme.drawerMenuButtonStyle.titleColorBlue
      : theme.drawerMenuButtonStyle.titleColorGrey;

    return subtitle ? (
      <glamorous.Text
        allowFontScaling={false}
        style={theme.drawerMenuButtonStyle.subtitleFontStyle}
        flex={1}
        numberOfLines={1}
        textAlign="right"
        alignSelf="center"
        marginRight={15}
        color={
          this.state.isUnderlayVisible ? theme.titleColorActive : titleColor
        }
      >
        {subtitle}
      </glamorous.Text>
    ) : null;
  }

  renderDisclosureIndicator() {
    const { hasDisclosureIndicator } = this.props;

    return hasDisclosureIndicator ? (
      <glamorous.Image
        source={require("../../assets/images/right-disclosure.png")}
        width={11}
        height={17}
        marginLeft={15}
        marginRight={15}
        alignSelf="center"
      />
    ) : null;
  }

  render() {
    const { onPress, theme } = this.props;

    return (
      <glamorous.TouchableHighlight
        underlayColor={theme.underlayColor}
        onPress={onPress}
        onShowUnderlay={() => {
          this.setState({ isUnderlayVisible: true });
        }}
        onHideUnderlay={() => {
          this.setState({ isUnderlayVisible: false });
        }}
      >
        <glamorous.View
          flexDirection="row"
          justifyContent="space-between"
          height={38}
        >
          {this.renderTitle()}
          {this.renderSubtitle()}
          {this.renderDisclosureIndicator()}
        </glamorous.View>
      </glamorous.TouchableHighlight>
    );
  }
}

DrawerButton.propTypes = {
  onPress: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  hasDisclosureIndicator: PropTypes.bool,
  theme: ThemePropType.isRequired,
};

DrawerButton.defaultProps = {
  subtitle: null,
  hasDisclosureIndicator: false,
};

export default withTheme(DrawerButton);
