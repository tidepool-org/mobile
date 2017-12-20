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
} from "../actions/navigation";
import { authSignOutAsync } from "../actions/auth";

class DrawerContainer extends PureComponent {
  render() {
    const { currentUser } = this.props;

    return (
      <Drawer
        style={{
          flex: 1,
          marginTop: 0,
        }}
        currentUser={currentUser}
        navigateDrawerClose={this.props.navigateDrawerClose}
        navigateSwitchProfile={this.props.navigateSwitchProfile}
        navigateSupport={this.props.navigateSupport}
        navigatePrivacyAndTerms={this.props.navigatePrivacyAndTerms}
        authSignOutAsync={this.props.authSignOutAsync}
      />
    );
  }
}

DrawerContainer.propTypes = {
  navigateDrawerClose: PropTypes.func.isRequired,
  navigateSwitchProfile: PropTypes.func.isRequired,
  navigateSupport: PropTypes.func.isRequired,
  navigatePrivacyAndTerms: PropTypes.func.isRequired,
  authSignOutAsync: PropTypes.func.isRequired,
  currentUser: PropTypes.shape({
    username: PropTypes.string.isRequired,
  }).isRequired,
};

const mapStateToProps = state => ({
  currentUser: {
    username: state.auth.username,
    fullName: state.auth.fullName,
  },
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      navigateDrawerClose,
      navigateSwitchProfile,
      navigateSupport,
      navigatePrivacyAndTerms,
      authSignOutAsync,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(DrawerContainer);
