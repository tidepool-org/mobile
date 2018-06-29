import React, { PureComponent } from "react";
import PropTypes from "prop-types";

import DrawerButton from "./DrawerButton";

class DrawerSwitchProfileButton extends PureComponent {
  onPress = () => {
    const { navigateDrawerClose, navigateSwitchProfile } = this.props;
    navigateDrawerClose();
    navigateSwitchProfile();
  };

  render() {
    return (
      <DrawerButton
        onPress={this.onPress}
        title="Switch Profile"
        hasDisclosureIndicator
      />
    );
  }
}

DrawerSwitchProfileButton.propTypes = {
  navigateSwitchProfile: PropTypes.func.isRequired,
  navigateDrawerClose: PropTypes.func.isRequired,
};

export default DrawerSwitchProfileButton;
