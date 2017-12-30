import React from "react";
import { connect } from "react-redux";
import { ThemeProvider } from "glamorous-native";

import PrimaryTheme from "../themes/PrimaryTheme";
import HeaderTitle from "../components/HeaderTitle";
import { ProfilePropType } from "../prop-types/profile";

const mapStateToProps = state => ({
  currentProfile: state.profile.currentProfile,
});

const HeaderTitleWithTheme = ({ currentProfile }) => (
  <ThemeProvider theme={PrimaryTheme}>
    <HeaderTitle currentProfile={currentProfile} />
  </ThemeProvider>
);

HeaderTitleWithTheme.propTypes = {
  currentProfile: ProfilePropType.isRequired,
};

export default connect(mapStateToProps)(HeaderTitleWithTheme);
