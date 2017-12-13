import React, { Component } from "react";
import PropTypes from "prop-types";

import DrawerButton from "./DrawerButton";

class DrawerSwitchProfileButton extends Component {
  onPress = () => {
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
};

export default DrawerSwitchProfileButton;
