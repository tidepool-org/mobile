import React, { Component } from "react";
import PropTypes from "prop-types";

import DrawerButton from "./DrawerButton";

class DrawerSupportButton extends Component {
  onPress = () => {
    this.props.navigation.dispatch({ type: "Support" });
  };

  render() {
    return <DrawerButton onPress={this.onPress} title="Tidepool Support" />;
  }
}

DrawerSupportButton.propTypes = {
  navigation: PropTypes.shape({
    dispatch: PropTypes.func.isRequired,
  }).isRequired,
};

export default DrawerSupportButton;
