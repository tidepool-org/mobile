import React, { PureComponent } from "react";
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

class DrawerContainer extends PureComponent {
  render() {
    const { currentUser, version, environment } = this.props;

    return (
      <Drawer
        style={{
          flex: 1,
          marginTop: 0,
        }}
        navigateDrawerClose={this.props.navigateDrawerClose}
        navigateSwitchProfile={this.props.navigateSwitchProfile}
        navigateSupport={this.props.navigateSupport}
        navigatePrivacyAndTerms={this.props.navigatePrivacyAndTerms}
        navigateDebugSettings={this.props.navigateDebugSettings}
        authSignOutAsync={this.props.authSignOutAsync}
        currentUser={currentUser}
        version={version}
        environment={environment}
      />
    );
  }
}

DrawerContainer.propTypes = {
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
  environment: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  currentUser: {
    username: state.auth.username,
    fullName: state.auth.fullName,
  },
  version: state.appVersion,
  environment: state.environment,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
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
