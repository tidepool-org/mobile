import React from "react";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { ThemeProvider } from "glamorous-native";

import Drawer from "../components/Drawer";
import PrimaryTheme from "../themes/PrimaryTheme";
import {
  navigateDrawerClose,
  navigateSignIn,
  navigateSwitchProfile,
  navigateSupport,
  navigatePrivacyAndTerms,
} from "../actions/navigation";

const DrawerContainer = props => (
  <ThemeProvider theme={PrimaryTheme}>
    <Drawer
      style={{
        flex: 1,
        marginTop: 0,
      }}
      currentUser={{ username: "email@gmail.com" }} // TODO: redux
      navigateDrawerClose={props.navigateDrawerClose}
      navigateSignIn={props.navigateSignIn}
      navigateSwitchProfile={props.navigateSwitchProfile}
      navigateSupport={props.navigateSupport}
      navigatePrivacyAndTerms={props.navigatePrivacyAndTerms}
    />
  </ThemeProvider>
);

DrawerContainer.propTypes = {
  navigateDrawerClose: PropTypes.func.isRequired,
  navigateSignIn: PropTypes.func.isRequired,
  navigateSwitchProfile: PropTypes.func.isRequired,
  navigateSupport: PropTypes.func.isRequired,
  navigatePrivacyAndTerms: PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      navigateDrawerClose,
      navigateSignIn,
      navigateSwitchProfile,
      navigateSupport,
      navigatePrivacyAndTerms,
    },
    dispatch,
  );
}

export default connect(null, mapDispatchToProps)(DrawerContainer);
