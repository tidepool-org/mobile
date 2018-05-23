import React from "react";
import { Svg } from "expo";

const { Path, Polygon } = Svg;

class GraphNoteEventSvg {
  static render({
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
}

export default GraphNoteEventSvg;
