import React, { Component } from "react";

import DrawerButton from "./DrawerButton";

class DrawerSwitchProfileButton extends Component {
  onPress = () => {
    // TODO: metrics
    // console.log("switch profile button tapped");
    // TODO: switch profile screen - navigate to Switch Profile screen
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

export default DrawerSwitchProfileButton;
