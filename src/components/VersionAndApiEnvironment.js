import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import glamorous, { withTheme } from "glamorous-native";

import { ThemePropType } from "../prop-types/theme";
import { API_ENVIRONMENT_PRODUCTION } from "../api";

class VersionAndApiEnvironment extends PureComponent {
  render() {
    const { theme, apiEnvironment, version, small } = this.props;

    return (
      <glamorous.View
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
      >
        <glamorous.Text
          allowFontScaling={false}
          style={
            small ? theme.smallVersionStringStyle : theme.versionStringStyle
          }
        >
          v
          {version}
          {apiEnvironment !== API_ENVIRONMENT_PRODUCTION
            ? ` on ${apiEnvironment}`
            : ""}
        </glamorous.Text>
      </glamorous.View>
    );
  }
}

VersionAndApiEnvironment.propTypes = {
  theme: ThemePropType.isRequired,
  version: PropTypes.string.isRequired,
  apiEnvironment: PropTypes.string.isRequired,
  small: PropTypes.bool,
};

VersionAndApiEnvironment.defaultProps = {
  small: false,
};

export default withTheme(VersionAndApiEnvironment);
