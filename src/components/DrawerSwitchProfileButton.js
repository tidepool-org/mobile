import React, { PureComponent } from "react";
import PropTypes from "prop-types";

import DrawerButton from "./DrawerButton";

class DrawerSwitchProfileButton extends PureComponent {
  onPress = () => {
    this.props.navigateDrawerClose();
    this.props.navigateSwitchProfile();
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
