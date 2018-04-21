import React, { PureComponent } from "react";
import PropTypes from "prop-types";

import { Svg, Path, Polygon } from "../../svg-exports";

class GraphNoteEvent extends PureComponent {
  static renderNoteEventSvgElements({
    eventTimeSeconds,
    graphStartTimeSeconds,
    pixelsPerSecond,
    height,
  }) {
    const timeIntervalSeconds = eventTimeSeconds - graphStartTimeSeconds;
    const x = Math.round(pixelsPerSecond * timeIntervalSeconds);
    const verticalLinePathDescription = `M${x} ${0} L${x} ${height}`;
    const triangleWidth = 15.5;
    const triangleHeight = Math.sqrt(
      triangleWidth * triangleWidth - triangleWidth / 2
    );
    const trianglePoints = `${x - triangleWidth / 2}, 0 ${x +
      triangleWidth / 2}, 0 ${x}, ${triangleHeight}`;

    const svgElements = [
      <Path
        key={1}
        d={verticalLinePathDescription}
        stroke="black"
        strokeLinecap="square"
        strokeLineJoin="round"
        strokeWidth="1.5"
      />,
      <Polygon
        key={2}
        points={trianglePoints}
        fill="black"
        stroke="black"
        strokeWidth="1.5"
      />,
    ];
    return svgElements;
  }

  render() {
    // console.log("GraphNoteEvent: render");

    const {
      graphFixedLayoutInfo: { height },
      scaledContentWidth,
      eventTimeSeconds,
      graphStartTimeSeconds,
      pixelsPerSecond,
    } = this.props.graphScalableLayoutInfo;

    const svgElements = GraphNoteEvent.renderNoteEventSvgElements({
      eventTimeSeconds,
      graphStartTimeSeconds,
      pixelsPerSecond,
      height,
    });

    return (
      <Svg height={height} width={scaledContentWidth}>
        {svgElements}
      </Svg>
    );
  }
}

GraphNoteEvent.propTypes = {
  graphScalableLayoutInfo: PropTypes.object.isRequired,
};

export { GraphNoteEvent as GraphNoteEventClass };
export default GraphNoteEvent;
