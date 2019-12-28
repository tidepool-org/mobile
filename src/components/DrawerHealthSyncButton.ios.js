import React, { PureComponent } from "react";
import PropTypes from "prop-types";

import { Metrics } from "../models/Metrics";
import DrawerButton from "./DrawerButton";

class DrawerHealthSyncButton extends PureComponent {
  onPress = () => {
    const { navigateDrawerClose, navigateHealthSync } = this.props;
    Metrics.track({ metric: "Clicked sync health data (Home screen)" });
    navigateDrawerClose();
    navigateHealthSync({ isInitialSync: false });
  };

  render() {
    return (
      <DrawerButton
        onPress={this.onPress}
        title="Sync Health data now"
        hasDisclosureIndicator
      />
    );
  }
}

DrawerHealthSyncButton.propTypes = {
  navigateHealthSync: PropTypes.func.isRequired,
  navigateDrawerClose: PropTypes.func.isRequired,
};

export default DrawerHealthSyncButton;
