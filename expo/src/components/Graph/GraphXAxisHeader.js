import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Svg } from "expo";
import glamorous, { withTheme } from "glamorous-native";
import format from "date-fns/format";
import addSeconds from "date-fns/add_seconds";

import { ThemePropType } from "../../prop-types/theme";

class GraphXAxisHeader extends PureComponent {
  calculateTimeMarkers() {
    const result = {
      markerXCoordinates: [],
      markerLengths: [],
      markerLabels: [],
    };

    const {
      graphScalableLayoutInfo: {
        graphStartTimeSeconds,
        secondsPerTick,
        pixelsPerSecond,
        pixelsPerTick,
        scaledContentWidth,
      },
    } = this.props;
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

  renderTimeMarkerTicks({ markerXCoordinates, markerLengths }) {
    const {
      theme,
      graphScalableLayoutInfo: { graphFixedLayoutInfo: { headerHeight } },
    } = this.props;

    const paths = new Array(markerXCoordinates.length);
    for (let i = 0; i < markerXCoordinates.length; i += 1) {
      const verticalLinePathDescription = `M${
        markerXCoordinates[i]
      } ${headerHeight - markerLengths[i]} L${
        markerXCoordinates[i]
      } ${headerHeight}`;
      paths.push(
        <Svg.Path
          key={i}
          d={verticalLinePathDescription}
          stroke={theme.graphLineStrokeColor}
          strokeWidth="1.5"
        />
      );
    }
    return paths;
  }

  renderTimeMarkerLabel({ width, left, top, markerLabel }) {
    const { theme } = this.props;

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

  renderTimeMarkerLabels({ markerLabels, markerXCoordinates }) {
    const result = new Array(markerXCoordinates.length);
    for (let i = 0; i < markerXCoordinates.length; i += 1) {
      const markerLabel = markerLabels[i];
      const width = 50;
      const left = markerXCoordinates[i] - width / 2;
      const top = 0;
      result.push(
        this.renderTimeMarkerLabel({ width, left, top, markerLabel })
      );
    }
    return result;
  }

  render() {
    // console.log("GraphXAxisHeader: render");

    const {
      graphFixedLayoutInfo: { headerHeight },
      scaledContentWidth,
    } = this.props.graphScalableLayoutInfo;

    const {
      markerXCoordinates,
      markerLengths,
      markerLabels,
    } = this.calculateTimeMarkers();

    return (
      <glamorous.View>
        <Svg height={headerHeight} width={scaledContentWidth}>
          {this.renderTimeMarkerTicks({ markerXCoordinates, markerLengths })}
        </Svg>
        {this.renderTimeMarkerLabels({ markerXCoordinates, markerLabels })}
      </glamorous.View>
    );
  }
}

GraphXAxisHeader.propTypes = {
  theme: ThemePropType.isRequired,
  graphScalableLayoutInfo: PropTypes.object.isRequired,
};

export default withTheme(GraphXAxisHeader);
