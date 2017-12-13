import React, { Component } from "react";
import PropTypes from "prop-types";

import DrawerButton from "./DrawerButton";

class DrawerSupportButton extends Component {
  onPress = () => {
    this.props.navigateSupport();
  };

  render() {
    return <DrawerButton onPress={this.onPress} title="Tidepool Support" />;
  }
}

DrawerSupportButton.propTypes = {
  navigateSupport: PropTypes.func.isRequired,
};

export default DrawerSupportButton;
