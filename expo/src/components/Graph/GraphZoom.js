import React, { Component } from "react";
import PropTypes from "prop-types";
import glamorous from "glamorous-native";

import PinchZoomResponder from "react-native-pinch-zoom-responder";

// FIXME: For iOS, it seems that touching "How to upload" and then adding another touch (for pinch), messes up the scale calculation (internally in PinchZoomResponder). Android doesn't have this issue. It's an edge case, but, would be good to debug / fix that at some point.

class GraphZoom extends Component {
  constructor(props) {
    super(props);

    this.scale = 1.0;
    this.pinchZoomResponder = new PinchZoomResponder(
      {
        onPinchZoomStart: () => {
          this.scale = 1.0;
        },

        onPinchZoomEnd: () => {
          props.onZoomEnd(this.scale);
        },

        onResponderMove: (e, gestureState) => {
          if (gestureState) {
            const { scaleX: scale } = gestureState;
            this.scale = scale;
            props.onZoomMove(scale);
          }
        },
      },
      {
        transformY: false,
      }
    );
    // Override some of the default PinchZoomResponder negotiation handlers so the touch handling on our children still works
    this.pinchZoomResponder.handlers.onStartShouldSetResponder = ({
      nativeEvent: { touches },
    }) => this.props.isEnabled && touches.length === 2;
    delete this.pinchZoomResponder.handlers.onMoveShouldSetResponder;
    delete this.pinchZoomResponder.handlers.onStartShouldSetResponderCapture;
    delete this.pinchZoomResponder.handlers.onMoveShouldSetResponderCapture;
    delete this.pinchZoomResponder.handlers.onResponderTerminationRequest;
    delete this.pinchZoomResponder.handlers.onResponderTerminationRequest;
  }

  render() {
    const { graphFixedLayoutInfo } = this.props;

    return (
      <glamorous.View
        backgroundColor="transparent"
        height={graphFixedLayoutInfo.height}
        width={graphFixedLayoutInfo.width}
        {...this.pinchZoomResponder.handlers}
      >
        {this.props.children}
      </glamorous.View>
    );
  }
}

GraphZoom.propTypes = {
  isEnabled: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.element,
  ]).isRequired,
  graphFixedLayoutInfo: PropTypes.object.isRequired,
  onZoomMove: PropTypes.func.isRequired,
  onZoomEnd: PropTypes.func.isRequired,
};

GraphZoom.defaultProps = {
  isEnabled: true,
};

export default GraphZoom;
