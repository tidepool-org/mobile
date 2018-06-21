import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Dimensions } from "react-native";
import WalkthroughTooltip from "react-native-walkthrough-tooltip";

class Tooltip extends PureComponent {
  render() {
    const { children, ...rest } = this.props;

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
      >
        {children}
      </WalkthroughTooltip>
    );
  }
}

Tooltip.propTypes = {
  children: PropTypes.element.isRequired,
  tooltipOriginOffset: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }),
};

Tooltip.defaultProps = {
  tooltipOriginOffset: undefined,
};

export default Tooltip;
