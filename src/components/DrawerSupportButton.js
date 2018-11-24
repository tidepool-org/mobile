import React, { PureComponent } from "react";
import PropTypes from "prop-types";

import Metrics from "../models/Metrics";
import DrawerButton from "./DrawerButton";

class DrawerSupportButton extends PureComponent {
  onPress = () => {
    const { navigateSupport } = this.props;
    Metrics.track({ metric: "Clicked Tidepool Support (Hamburger)" });
    navigateSupport();
  };

  render() {
    return <DrawerButton onPress={this.onPress} title="Tidepool Support" />;
  }
}

DrawerSupportButton.propTypes = {
  navigateSupport: PropTypes.func.isRequired,
};

export default DrawerSupportButton;
