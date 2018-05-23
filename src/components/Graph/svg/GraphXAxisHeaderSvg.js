import React from "react";
import glamorous from "glamorous-native";
import { Svg } from "expo";

import { calculateTimeMarkers } from "../helpers";

const { Path } = Svg;

class GraphXAxisHeaderSvg {
  static renderTicksSvgElements({
    theme,
    markerXCoordinates,
    markerLengths,
    headerHeight,
  }) {
    const paths = new Array(markerXCoordinates.length);
    for (let i = 0; i < markerXCoordinates.length; i += 1) {
      const verticalLinePathDescription = `M${
        markerXCoordinates[i]
      } ${headerHeight - markerLengths[i]} L${
        markerXCoordinates[i]
      } ${headerHeight}`;
      paths.push(
        <Path
          key={i}
          d={verticalLinePathDescription}
          stroke={theme.graphLineStrokeColor}
          strokeWidth="1.5"
        />
      );
    }
    return paths;
  }

  static renderLabel({ theme, width, left, top, markerLabel }) {
    return (
      <glamorous.Text
        key={left}
        allowFontScaling={false}
        position="absolute"
        pointerEvents="none"
        left={left}
        top={top}
        style={theme.graphYAxisLabelStyle}
        width={width}
        textAlign="center"
      >
        {markerLabel}
      </glamorous.Text>
    );
  }

  static renderLabelsViews({ theme, markerLabels, markerXCoordinates }) {
    const result = new Array(markerXCoordinates.length);
    for (let i = 0; i < markerXCoordinates.length; i += 1) {
      const markerLabel = markerLabels[i];
      const width = 50;
      const left = markerXCoordinates[i] - width / 2;
      const top = 0;
      result.push(
        GraphXAxisHeaderSvg.renderLabel({
          theme,
          width,
          left,
          top,
          markerLabel,
        })
      );
    }
    return result;
  }

  static renderTicksAndLabels({
    theme,
    graphScalableLayoutInfo,
    graphScalableLayoutInfo: {
      graphFixedLayoutInfo: { headerHeight },
    },
  }) {
    const {
      markerXCoordinates,
      markerLengths,
      markerLabels,
    } = calculateTimeMarkers({ graphScalableLayoutInfo });

    const ticks = GraphXAxisHeaderSvg.renderTicksSvgElements({
      theme,
      markerXCoordinates,
      markerLengths,
      headerHeight,
    });

    const labels = GraphXAxisHeaderSvg.renderLabelsViews({
      theme,
      markerXCoordinates,
      markerLabels,
    });

    return {
      ticks,
      labels,
    };
  }
}

export default GraphXAxisHeaderSvg;
