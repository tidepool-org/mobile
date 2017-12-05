import React, { Component } from "react";
import PropTypes from "prop-types";

import DrawerButton from "./DrawerButton";

class DrawerSwitchProfileButton extends Component {
  onPress = () => {
    // TODO: metrics
    // console.log("switch profile button tapped");
    this.props.navigation.navigate("SwitchProfile");
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
    navigate: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
  }).isRequired,
};

export default DrawerSwitchProfileButton;
