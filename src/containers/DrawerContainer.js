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
  render() {
    const { currentUser, version, apiEnvironment } = this.props;
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
        notesSwitchProfileAndFetchAsync={
          this.props.notesSwitchProfileAndFetchAsync
        }
        navigateDrawerClose={this.props.navigateDrawerClose}
        navigateSwitchProfile={this.props.navigateSwitchProfile}
        navigateSupport={this.props.navigateSupport}
        navigatePrivacyAndTerms={this.props.navigatePrivacyAndTerms}
        navigateDebugSettings={this.props.navigateDebugSettings}
        authSignOutAsync={this.props.authSignOutAsync}
        currentUser={currentUser}
        version={version}
        apiEnvironment={apiEnvironment}
      />
    );
  }
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
  version: PropTypes.string.isRequired,
  apiEnvironment: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  currentUser: state.auth,
  version: state.appVersion,
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

export default connect(mapStateToProps, mapDispatchToProps)(DrawerContainer);
