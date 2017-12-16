import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import glamorous, { withTheme } from "glamorous-native";

import ThemePropTypes from "../themes/ThemePropTypes";

class HeaderTitle extends PureComponent {
  render() {
    const { theme, currentProfile: { fullName } } = this.props;

    return (
      <glamorous.Text
        style={theme.navHeaderTitleStyle}
        allowFontScaling={false}
        numberOfLines={1}
      >
        {fullName}
      </glamorous.Text>
    );
  }
}

HeaderTitle.propTypes = {
  theme: ThemePropTypes.isRequired,
  currentProfile: PropTypes.shape({
    fullName: PropTypes.string.isRequired,
  }).isRequired,
};

export default withTheme(HeaderTitle);
