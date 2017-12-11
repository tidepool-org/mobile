import React, { Component } from "react";
import PropTypes from "prop-types";

import DrawerButton from "./DrawerButton";

class DrawerPrivacyAndTermsButton extends Component {
  onPress = () => {
    this.props.navigation.dispatch({ type: "PrivacyAndTerms" });
  };

  render() {
    return (
      <DrawerButton
        onPress={this.onPress}
        title="Privacy Policy and Terms of Use"
      />
    );
  }
}

DrawerPrivacyAndTermsButton.propTypes = {
  navigation: PropTypes.shape({
    dispatch: PropTypes.func.isRequired,
  }).isRequired,
};

export default DrawerPrivacyAndTermsButton;
