import React, { PureComponent } from "react";
import glamorous, { withTheme } from "glamorous-native";

import { ProfilePropType } from "../prop-types/profile";
import { ThemePropType } from "../prop-types/theme";

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
  theme: ThemePropType.isRequired,
  currentProfile: ProfilePropType.isRequired,
};

export default withTheme(HeaderTitle);
