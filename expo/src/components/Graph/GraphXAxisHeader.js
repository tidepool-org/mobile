import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import glamorous, { withTheme } from "glamorous-native";
import format from "date-fns/format";
import addSeconds from "date-fns/add_seconds";

import { Svg, Path } from "../../svg-exports";
import { ThemePropType } from "../../prop-types/theme";

class GraphXAxisHeader extends PureComponent {
  static calculateTimeMarkers({ graphScalableLayoutInfo }) {
    const result = {
      markerXCoordinates: [],
      markerLengths: [],
      markerLabels: [],
    };

    const {
      graphStartTimeSeconds,
      secondsPerTick,
      pixelsPerSecond,
      pixelsPerTick,
      scaledContentWidth,
    } = graphScalableLayoutInfo;
    const nextTickBoundarySeconds =
      Math.floor(graphStartTimeSeconds / secondsPerTick) * secondsPerTick;
    const timeOffset = nextTickBoundarySeconds - graphStartTimeSeconds;

    let xOffset = Math.floor(timeOffset * pixelsPerSecond);
    let currentDate = new Date(nextTickBoundarySeconds * 1000);
    do {
      let formattedDate = format(currentDate, "h:mm a");
      formattedDate = formattedDate.replace("am", "a");
      formattedDate = formattedDate.replace("pm", "p");
      formattedDate = formattedDate.replace(":00", "");
      // const isMidnight = formattedDate === "12 a"; // TODO: graph - use same midnight marker line and label treatment as Tidepool Mobile 2.x

      const markerLength = 8.0; // isMidnight ? layout.headerHeight : 8.0
      result.markerXCoordinates.push(xOffset);
      result.markerLengths.push(markerLength);
      result.markerLabels.push(formattedDate);

      currentDate = addSeconds(currentDate, secondsPerTick);
      xOffset += pixelsPerTick;
    } while (xOffset < scaledContentWidth);

    return result;
  }

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
        GraphXAxisHeader.renderLabel({
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
    graphScalableLayoutInfo: { graphFixedLayoutInfo: { headerHeight } },
  }) {
    const {
      markerXCoordinates,
      markerLengths,
      markerLabels,
    } = GraphXAxisHeader.calculateTimeMarkers({ graphScalableLayoutInfo });

    const ticks = GraphXAxisHeader.renderTicksSvgElements({
      theme,
      markerXCoordinates,
      markerLengths,
      headerHeight,
    });

    const labels = GraphXAxisHeader.renderLabelsViews({
      theme,
      markerXCoordinates,
      markerLabels,
    });

    return {
      ticks,
      labels,
    };
  }

  render() {
    // console.log("GraphXAxisHeader: render");

    const {
      theme,
      graphScalableLayoutInfo,
      graphScalableLayoutInfo: {
        graphFixedLayoutInfo: { headerHeight },
        scaledContentWidth,
      },
    } = this.props;

    const { ticks, labels } = GraphXAxisHeader.renderTicksAndLabels({
      theme,
      graphScalableLayoutInfo,
    });

    return (
      <glamorous.View backgroundColor="white">
        <Svg height={headerHeight} width={scaledContentWidth}>
          {ticks}
        </Svg>
        {labels}
      </glamorous.View>
    );
  }
}

GraphXAxisHeader.propTypes = {
  theme: ThemePropType.isRequired,
  graphScalableLayoutInfo: PropTypes.object.isRequired,
};

export { GraphXAxisHeader as GraphXAxisHeaderClass };
export default withTheme(GraphXAxisHeader);
