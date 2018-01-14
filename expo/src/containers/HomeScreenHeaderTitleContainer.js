import React from "react";
import { connect } from "react-redux";
import { ThemeProvider } from "glamorous-native";

import PrimaryTheme from "../themes/PrimaryTheme";
import HomeScreenHeaderTitle from "../components/HomeScreenHeaderTitle";
import { ProfilePropType } from "../prop-types/profile";

const mapStateToProps = state => ({
  currentProfile: state.profile.currentProfile,
});

const HomeScreenHeaderTitleWithTheme = ({ currentProfile }) => (
  <ThemeProvider theme={PrimaryTheme}>
    <HomeScreenHeaderTitle currentProfile={currentProfile} />
  </ThemeProvider>
);

HomeScreenHeaderTitleWithTheme.propTypes = {
  currentProfile: ProfilePropType.isRequired,
};

export default connect(mapStateToProps)(HomeScreenHeaderTitleWithTheme);
