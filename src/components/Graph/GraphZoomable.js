import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { PanResponder } from "react-native";
import glamorous, { withTheme } from "glamorous-native";

import { ThemePropType } from "../../prop-types/theme";

class GraphZoomable extends PureComponent {
  constructor(props) {
    super(props);

    this.scale = 1.0;
    this.isZooming = false;
    this.trackedTouches = [];
    this.pinchZoomResponder = PanResponder.create({
      onStartShouldSetPanResponder: ({ nativeEvent: { target, touches } }) => {
        const { isZoomingEnabled } = this.props;
        this.target = target;
        const filteredTouches = this.filterTouchesOnTarget(touches);
        const shouldStartZooming =
          isZoomingEnabled && filteredTouches.length === 2;
        // console.log(
        //   `onStartShouldSetPanResponder, should recognize gesture: ${shouldStartZooming}, target: ${target}, isZoomingEnabled: ${
        //     this.props.isZoomingEnabled
        //   }`
        // );
        return shouldStartZooming;
      },
      // onPanResponderReject: () => console.log("onPanResponderReject"),
      onPanResponderStart: ({ nativeEvent: { touches } }) => {
        // console.log(`onPanResponderStart`);
        if (touches.length <= 2) {
          if (this.isZooming) {
            this.commitZoom();
            this.trackTouches(this.filterTouchesOnTarget(touches));
          } else {
            this.startZooming(this.filterTouchesOnTarget(touches));
          }
        }
      },
      onPanResponderMove: ({ nativeEvent: { touches } }) => {
        if (touches.length <= 2) {
          const { onZoomMove } = this.props;
          const touchesOnTarget = this.filterTouchesOnTarget(touches);
          this.updateScaleAndTrackTouches(touchesOnTarget);
          onZoomMove(this.scale);
          // console.log(
          //   `onPanResponderMove, touches: ${
          //     touches.length
          //   }, touches on target: ${touchesOnTarget.length}, tracked touches ${
          //     this.trackedTouches.length
          //   }, new scale: ${this.scale}`
          // );
        } else {
          // console.log(`onPanResponderMove, touchCount ${touches.length}`);
        }
      },
      onPanResponderRelease: () => {
        // console.log("onPanResponderRelease");
        this.stopZooming();
      },
      onPanResponderTerminate: () => {
        // console.log("onPanResponderTerminate");
        this.stopZooming();
      },
      onPanResponderTerminationRequest: () => false,
    });
  }

  startZooming(touches) {
    if (!this.isZooming) {
      // console.log("startZooming");
      const { onZoomStart } = this.props;
      this.scale = 1.0;
      this.isZooming = true;
      this.trackTouches(touches);
      onZoomStart(this.scale);
    }
  }

  stopZooming() {
    if (this.isZooming) {
      // console.log("stopZooming");
      const { onZoomEnd } = this.props;
      this.commitZoom();
      onZoomEnd(this.scale);
      this.isZooming = false;
    }
  }

  commitZoom() {
    const { onZoomCommit } = this.props;
    // console.log(`commitZoom: ${this.scale}`);
    onZoomCommit(this.scale);
    this.scale = 1;
  }

  filterTouchesOnTarget(touches) {
    // Only include up to two touches that have the same target as the view
    return touches.filter(touch => touch.target === this.target).slice(0, 2);
  }

  trackTouches(touches) {
    this.trackedTouches = touches;
  }

  updateScaleAndTrackTouches(touches) {
    const touchCount = touches.length;
    const trackedTouchCount = this.trackedTouches.length;
    if (touchCount <= 1) {
      // If there is only one touch, and there were previously two tracked touches, then commit the zoom
      if (touchCount === 1 && this.trackedTouches.length === 2) {
        this.commitZoom();
      }
      // Reset tracked touches
      this.trackTouches(touches);
    } else if (trackedTouchCount === 0) {
      // Just track the new touches if we weren't tracking any before
      this.trackTouches(touches);
    } else if (trackedTouchCount === 1) {
      // If there was one tracked touch before and now there are more, then reset tracked touches
      this.trackTouches(touches);
    } else if (trackedTouchCount === 2) {
      // If there were two tracked touches before and there are two or more now, and the same two
      // tracked touches exist as before, then update the scale for those two tracked touches,
      // ignoring any new touches.
      const trackedTouch1 = this.trackedTouches[0];
      const trackedTouch2 = this.trackedTouches[1];
      let trackedTouch1StillExists = false;
      let trackedTouch2StillExists = false;
      let touch1;
      let touch2;
      touches.forEach(touch => {
        if (touch.identifier === trackedTouch1.identifier) {
          trackedTouch1StillExists = true;
          touch1 = touch;
        } else if (touch.identifier === trackedTouch2.identifier) {
          trackedTouch2StillExists = true;
          touch2 = touch;
        }
      });
      if (trackedTouch1StillExists && trackedTouch2StillExists) {
        // Update scale
        const currentTouchDistance = Math.abs(touch1.pageX - touch2.pageX);
        const trackedTouchDistance = Math.abs(
          trackedTouch1.pageX - trackedTouch2.pageX
        );
        this.scale = currentTouchDistance / trackedTouchDistance;
      } else {
        // If there were two touches before, and there are two or more now, but the two tracked
        // touches don't still exist, then don't update scale and reset the tracked touches to an
        // empty set. We'll start tracking again once we have one or two touches.
        this.trackedTouches = [];
      }
    }
  }

  render() {
    // console.log(
    //   `GraphZoomable: render, isZoomingEnabled: ${this.props.isZoomingEnabled}`
    // );

    const { graphFixedLayoutInfo, children } = this.props;

    return (
      <glamorous.View
        innerRef={containerView => {
          this.containerView = containerView;
        }}
        backgroundColor="white"
        height={graphFixedLayoutInfo.height}
        width={graphFixedLayoutInfo.width}
        {...this.pinchZoomResponder.panHandlers}
      >
        {children}
      </glamorous.View>
    );
  }
}

GraphZoomable.propTypes = {
  theme: ThemePropType.isRequired,
  isZoomingEnabled: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.element,
  ]).isRequired,
  graphFixedLayoutInfo: PropTypes.object.isRequired,
  onZoomStart: PropTypes.func.isRequired,
  onZoomMove: PropTypes.func.isRequired,
  onZoomCommit: PropTypes.func.isRequired,
  onZoomEnd: PropTypes.func.isRequired,
};

GraphZoomable.defaultProps = {
  isZoomingEnabled: true,
};

export default withTheme(GraphZoomable);
