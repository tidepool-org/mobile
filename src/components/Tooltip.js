import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Dimensions } from "react-native";
import WalkthroughTooltip from "react-native-walkthrough-tooltip";

class Tooltip extends PureComponent {
  render() {
    const { children, adjustPlacementStyle, ...rest } = this.props;

    const SCREEN_HEIGHT = Dimensions.get("window").height - 48;
    const SCREEN_WIDTH = Dimensions.get("window").width;
    const fullDisplayArea = {
      x: 0,
      y: 0,
      width: SCREEN_WIDTH,
      height: SCREEN_HEIGHT,
    };
    const onClose = () => {}; // Necessary to avoid warning for required Modal.onRequestClose on Android

    return (
      <WalkthroughTooltip
        displayArea={fullDisplayArea}
        onClose={onClose}
        {...rest}
        ref={tooltip => {
          if (tooltip && adjustPlacementStyle) {
            const tooltipMonkeyPatched = tooltip;
            const { getTooltipPlacementStyles } = tooltipMonkeyPatched;
            tooltipMonkeyPatched.getTooltipPlacementStyles = () => {
              const placementStyles = getTooltipPlacementStyles();
              const adjustedPlacementStyles = adjustPlacementStyle(
                placementStyles
              );
              return adjustedPlacementStyles;
            };
          }
        }}
      >
        {children}
      </WalkthroughTooltip>
    );
  }
}

Tooltip.propTypes = {
  children: PropTypes.element.isRequired,
  adjustPlacementStyle: PropTypes.func,
};

Tooltip.defaultProps = {
  adjustPlacementStyle: null,
};

export default Tooltip;
