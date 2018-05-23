import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Platform } from "react-native";
import glamorous, { withTheme } from "glamorous-native";

import { ThemePropType } from "../prop-types/theme";

class ModalScreenHeaderRight extends PureComponent {
  onPress = () => {
    this.props.action();
  };

  formattedTitle() {
    const { actionTitle } = this.props;

    return Platform.OS === "android" ? actionTitle.toUpperCase() : actionTitle;
  }

  render() {
    const { theme, disabled } = this.props;

    // Render differently, with different keys, for disabled vs. enabled states. This is due to a bug where setting opacity on disabled TouchableOpacity is ignored. See: https://github.com/facebook/react-native/issues/17105

    if (disabled) {
      return (
        <glamorous.TouchableOpacity
          key="disabled"
          disabled
          style={{
            padding: 10,
            marginRight: 6,
            opacity: 0.2,
          }}
        >
          <glamorous.Text style={theme.modalScreenHeaderRightDisabledTextStyle}>
            {this.formattedTitle()}
          </glamorous.Text>
        </glamorous.TouchableOpacity>
      );
    }

    return (
      <glamorous.TouchableOpacity
        key="enabled"
        style={{
          padding: 10,
          marginRight: 6,
          opacity: 1.0,
        }}
        onPress={this.onPress}
      >
        <glamorous.Text style={theme.modalScreenHeaderRightTextStyle}>
          {this.formattedTitle()}
        </glamorous.Text>
      </glamorous.TouchableOpacity>
    );
  }
}

ModalScreenHeaderRight.propTypes = {
  theme: ThemePropType.isRequired,
  actionTitle: PropTypes.string.isRequired,
  action: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
};

export default withTheme(ModalScreenHeaderRight);
