import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import glamorous, { withTheme } from "glamorous-native";
import PinchZoomResponder from "react-native-pinch-zoom-responder";

import { ThemePropType } from "../../prop-types/theme";

// FIXME: For iOS, it seems that touching "How to upload" and then adding another touch (for pinch), messes up the scale calculation (internally in PinchZoomResponder). Android doesn't have this issue. It's an edge case, but, would be good to debug / fix that at some point.

class GraphZoomable extends PureComponent {
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
    // console.log("GraphZoomable: render");

    const { graphFixedLayoutInfo } = this.props;

    return (
      <glamorous.View
        backgroundColor="white"
        height={graphFixedLayoutInfo.height}
        width={graphFixedLayoutInfo.width}
        {...this.pinchZoomResponder.handlers}
      >
        {this.props.children}
      </glamorous.View>
    );
  }
}

GraphZoomable.propTypes = {
  theme: ThemePropType.isRequired,
  isEnabled: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.element,
  ]).isRequired,
  graphFixedLayoutInfo: PropTypes.object.isRequired,
  onZoomMove: PropTypes.func.isRequired,
  onZoomEnd: PropTypes.func.isRequired,
};

GraphZoomable.defaultProps = {
  isEnabled: true,
};

export default withTheme(GraphZoomable);
