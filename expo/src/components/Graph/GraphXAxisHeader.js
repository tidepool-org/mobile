import React, { Component } from "react";
import PropTypes from "prop-types";
import { Svg } from "expo";
import glamorous from "glamorous-native";

// TODO: graph - x axis .. need to calc width .. and handle +/- 6 hours for zoomed out and +/- 1 hour(?) for zoom in
// TODO: graph - tick marks and how often they should go (e.g. every 15 minutes, every hour, every two hours, etc). Add an x-axis component to draw these

class GraphXAxisHeader extends Component {
  render() {
    const {
      graphFixedLayoutInfo: { headerHeight },
      scaledContentWidth,
      eventTime,
      startTime,
      pixelsPerSecond,
    } = this.props.graphScalableLayoutInfo;

    return null;
  }
}

GraphXAxisHeader.propTypes = {
  graphScalableLayoutInfo: PropTypes.object.isRequired,
};

export default GraphXAxisHeader;
