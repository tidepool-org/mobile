import React from "react";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { ThemeProvider } from "glamorous-native";

import Drawer from "../components/Drawer";
import PrimaryTheme from "../themes/PrimaryTheme";
import {
  navigateDrawerClose,
  navigateSwitchProfile,
  navigateSupport,
  navigatePrivacyAndTerms,
} from "../actions/navigation";
import { authSignOutAsync } from "../actions/auth";

const DrawerContainer = props => (
  <ThemeProvider theme={PrimaryTheme}>
    <Drawer
      style={{
        flex: 1,
        marginTop: 0,
      }}
      currentUser={{ username: "email@gmail.com" }} // TODO: redux
      navigateDrawerClose={props.navigateDrawerClose}
      navigateSwitchProfile={props.navigateSwitchProfile}
      navigateSupport={props.navigateSupport}
      navigatePrivacyAndTerms={props.navigatePrivacyAndTerms}
      authSignOutAsync={props.authSignOutAsync}
    />
  </ThemeProvider>
);

DrawerContainer.propTypes = {
  navigateDrawerClose: PropTypes.func.isRequired,
  navigateSwitchProfile: PropTypes.func.isRequired,
  navigateSupport: PropTypes.func.isRequired,
  navigatePrivacyAndTerms: PropTypes.func.isRequired,
  authSignOutAsync: PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      navigateDrawerClose,
      navigateSwitchProfile,
      navigateSupport,
      navigatePrivacyAndTerms,
      authSignOutAsync,
    },
    dispatch,
  );
}

export default connect(null, mapDispatchToProps)(DrawerContainer);
