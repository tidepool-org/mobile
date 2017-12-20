import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import glamorous, { withTheme } from "glamorous-native";

import ThemePropTypes from "../themes/ThemePropTypes";
import { ENVIRONMENT_PRODUCTION } from "../api";

class VersionAndEnvironment extends PureComponent {
  render() {
    const { theme, environment, version, small } = this.props;

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
          v{version}
          {environment !== ENVIRONMENT_PRODUCTION ? ` on ${environment}` : ""}
        </glamorous.Text>
      </glamorous.View>
    );
  }
}

VersionAndEnvironment.propTypes = {
  theme: ThemePropTypes.isRequired,
  version: PropTypes.string.isRequired,
  environment: PropTypes.string.isRequired,
  small: PropTypes.bool,
};

VersionAndEnvironment.defaultProps = {
  small: false,
};

export default withTheme(VersionAndEnvironment);
