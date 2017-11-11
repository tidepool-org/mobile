import React from "react";
import PropTypes from "prop-types";
import glamorous, { withTheme } from "glamorous-native";

import ThemePropTypes from "../themes/ThemePropTypes";

const VersionAndEnvironment = ({ theme, environment, version }) => (
  <glamorous.View
    flexDirection="row"
    justifyContent="center"
    alignItems="center"
  >
    <glamorous.Text style={theme.versionStringStyle}>
      {version}
      {environment !== "production" ? ` on ${environment}` : ""}
    </glamorous.Text>
  </glamorous.View>
);

VersionAndEnvironment.propTypes = {
  theme: ThemePropTypes.isRequired,
  version: PropTypes.string.isRequired,
  environment: PropTypes.string.isRequired,
};

export default withTheme(VersionAndEnvironment);
