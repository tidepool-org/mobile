import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { ThemeProvider } from "glamorous-native";

import PrimaryTheme from "../themes/PrimaryTheme";
import HeaderTitle from "../components/HeaderTitle";

const mapStateToProps = state => ({
  currentProfile: {
    fullName: state.profile.currentProfile.fullName,
  },
});

const HeaderTitleWithTheme = ({ currentProfile }) => (
  <ThemeProvider theme={PrimaryTheme}>
    <HeaderTitle currentProfile={currentProfile} />
  </ThemeProvider>
);

HeaderTitleWithTheme.propTypes = {
  currentProfile: PropTypes.shape({
    fullName: PropTypes.string.isRequired,
  }).isRequired,
};

export default connect(mapStateToProps)(HeaderTitleWithTheme);
