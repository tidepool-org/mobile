import React, { PureComponent } from "react";
import PropTypes from "prop-types";

import DrawerButton from "./DrawerButton";

class DrawerPrivacyAndTermsButton extends PureComponent {
  onPress = () => {
    const { navigatePrivacyAndTerms } = this.props;
    navigatePrivacyAndTerms();
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
  navigatePrivacyAndTerms: PropTypes.func.isRequired,
};

export default DrawerPrivacyAndTermsButton;
