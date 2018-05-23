import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import glamorous, { withTheme } from "glamorous-native";

import { ThemePropType } from "../prop-types/theme";

class ModalScreenHeaderTitle extends PureComponent {
  render() {
    const { theme, title } = this.props;

    return (
      <glamorous.Text
        style={theme.screenHeaderTitleStyle}
        allowFontScaling={false}
        numberOfLines={1}
      >
        {title}
      </glamorous.Text>
    );
  }
}

ModalScreenHeaderTitle.propTypes = {
  theme: ThemePropType.isRequired,
  title: PropTypes.string.isRequired,
};

export default withTheme(ModalScreenHeaderTitle);
