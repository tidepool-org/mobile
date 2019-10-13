import React, { PureComponent } from "react";
import { Platform, StatusBar } from "react-native";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import Drawer from "../components/Drawer";
import {
  navigateDrawerClose,
  navigateSwitchProfile,
  navigateSupport,
  navigatePrivacyAndTerms,
  navigateDebugSettings,
} from "../actions/navigation";
import { authSignOutAsync } from "../actions/auth";
import { notesSwitchProfileAndFetchAsync } from "../actions/notesFetch";

class DrawerContainer extends PureComponent {
  /* eslint-disable no-shadow */
  render() {
    const {
      currentUser,
      version,
      health,
      apiEnvironment,
      notesSwitchProfileAndFetchAsync,
      navigateDrawerClose,
      navigateSwitchProfile,
      navigateSupport,
      navigatePrivacyAndTerms,
      navigateDebugSettings,
      authSignOutAsync,
    } = this.props;
    let marginTop = 0;
    if (Platform.OS === "android") {
      marginTop += StatusBar.currentHeight;
    }

    return (
      <Drawer
        style={{
          flex: 1,
          marginTop,
        }}
        health={health}
        notesSwitchProfileAndFetchAsync={notesSwitchProfileAndFetchAsync}
        navigateDrawerClose={navigateDrawerClose}
        navigateSwitchProfile={navigateSwitchProfile}
        navigateSupport={navigateSupport}
        navigatePrivacyAndTerms={navigatePrivacyAndTerms}
        navigateDebugSettings={navigateDebugSettings}
        authSignOutAsync={authSignOutAsync}
        currentUser={currentUser}
        version={version}
        apiEnvironment={apiEnvironment}
      />
    );
  }
  /* eslint-enable no-shadow */
}

DrawerContainer.propTypes = {
  notesSwitchProfileAndFetchAsync: PropTypes.func.isRequired,
  navigateDrawerClose: PropTypes.func.isRequired,
  navigateSwitchProfile: PropTypes.func.isRequired,
  navigateSupport: PropTypes.func.isRequired,
  navigatePrivacyAndTerms: PropTypes.func.isRequired,
  navigateDebugSettings: PropTypes.func.isRequired,
  authSignOutAsync: PropTypes.func.isRequired,
  currentUser: PropTypes.shape({
    username: PropTypes.string.isRequired,
  }).isRequired,
  health: PropTypes.object.isRequired,
  version: PropTypes.string.isRequired,
  apiEnvironment: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  currentUser: state.auth,
  version: state.appVersion,
  health: state.health,
  apiEnvironment: state.apiEnvironment,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      notesSwitchProfileAndFetchAsync,
      navigateDrawerClose,
      navigateSwitchProfile,
      navigateSupport,
      navigatePrivacyAndTerms,
      navigateDebugSettings,
      authSignOutAsync,
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DrawerContainer);
