import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Svg } from "expo";

class GraphNoteEvent extends PureComponent {
  render() {
    // console.log("GraphNoteEvent: render");

    const {
      graphFixedLayoutInfo: { height },
      scaledContentWidth,
      eventTimeSeconds,
      graphStartTimeSeconds,
      pixelsPerSecond,
    } = this.props.graphScalableLayoutInfo;

    if (scaledContentWidth && height) {
      const timeIntervalSeconds = eventTimeSeconds - graphStartTimeSeconds;
      const x = Math.round(pixelsPerSecond * timeIntervalSeconds);
      const verticalLinePathDescription = `M${x} ${0} L${x} ${height}`;
      const triangleWidth = 15.5;
      const triangleHeight = Math.sqrt(
        triangleWidth * triangleWidth - triangleWidth / 2
      );
      const trianglePoints = `${x - triangleWidth / 2}, 0 ${x +
        triangleWidth / 2}, 0 ${x}, ${triangleHeight}`;

      return (
        <Svg height={height} width={scaledContentWidth}>
          <Svg.Path
            d={verticalLinePathDescription}
            stroke="black"
            strokeLinecap="square"
            strokeLineJoin="round"
            strokeWidth="1.5"
          />
          <Svg.Polygon
            points={trianglePoints}
            fill="black"
            stroke="black"
            strokeWidth="1.5"
          />
        </Svg>
      );
    }

    return null;
  }
}

GraphNoteEvent.propTypes = {
  graphScalableLayoutInfo: PropTypes.object.isRequired,
};

export default GraphNoteEvent;
