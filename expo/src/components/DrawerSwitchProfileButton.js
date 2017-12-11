import React, { Component } from "react";
import PropTypes from "prop-types";

import DrawerButton from "./DrawerButton";

class DrawerSwitchProfileButton extends Component {
  onPress = () => {
    this.props.navigation.dispatch({ type: "SwitchProfile" });
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
  navigation: PropTypes.shape({
    dispatch: PropTypes.func.isRequired,
  }).isRequired,
};

export default DrawerSwitchProfileButton;
