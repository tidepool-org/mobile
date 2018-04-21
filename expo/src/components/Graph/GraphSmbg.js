import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { withTheme } from "glamorous-native";

import { Svg, Circle, Text } from "../../svg-exports";
import { ThemePropType } from "../../prop-types/theme";
import { MAX_BG_VALUE } from "./helpers";

class GraphSmbg extends PureComponent {
  static renderSamplesSvgElements({
    theme,
    smbgData,
    yAxisHeightInPixels,
    yAxisPixelsPerValue,
    headerHeight,
    graphStartTimeSeconds,
    pixelsPerSecond,
  }) {
    const result = new Array(smbgData.length);
    for (let i = 0; i < smbgData.length; i += 1) {
      const { time, value, isLow, isHigh } = smbgData[i];
      let color = theme.graphBgNormalColor;
      if (isLow) {
        color = theme.graphBgLowColor;
      } else if (isHigh) {
        color = theme.graphBgHighColor;
      }
      const constrainedValue = Math.min(value, MAX_BG_VALUE);
      const deltaTime = time - graphStartTimeSeconds;
      const x = deltaTime * pixelsPerSecond;
      const y =
        headerHeight +
        Math.round(
          yAxisHeightInPixels - constrainedValue * yAxisPixelsPerValue
        );

      // Try to avoid intersecting labels
      //
      // Ideally we might have a background color for the bounding box of the label so that we can
      // just render all of them and have the later ones draw over the earlier ones, without much
      // visual conflict, and with a simpler implementation. However, SVG doesn't support
      // background property for text. So, we'd have to measure each label to calculate a bounding
      // box and then use an SVG rect to paint the background. That's too much trouble (and
      // probably too much perf penalty?), so, instead we just look for approximate intersections
      // of labels and avoid drawing the earlier one if the later one might intersect. This is
      // imperfect, but should give reasonable results in most scenarios and is performant.
      let nextSampleLabelMightIntersect = false;
      if (i < smbgData.length - 1) {
        const { time: nextTime, value: nextValue } = smbgData[i + 1];
        const nextConstrainedValue = Math.min(nextValue, MAX_BG_VALUE);
        const nextDeltaTime = nextTime - graphStartTimeSeconds;
        const nextX = nextDeltaTime * pixelsPerSecond;
        const nextY =
          headerHeight +
          Math.round(
            yAxisHeightInPixels - nextConstrainedValue * yAxisPixelsPerValue
          );
        const approximateTextHeight = 9;
        const approximateTextWidth = 21;
        if (
          nextX - x < approximateTextWidth &&
          nextY - y < approximateTextHeight
        ) {
          nextSampleLabelMightIntersect = true;
        }
      }
      if (!nextSampleLabelMightIntersect) {
        result.push(
          <Text
            key={i + 0.1}
            {...theme.graphSmbgLabelStyle}
            fill={color}
            stroke="none"
            x={x}
            y={y + 24}
            textAnchor="middle"
          >
            {value}
          </Text>
        );
      }
      result.push(
        <Circle
          key={i + 0.2}
          cx={x}
          cy={y}
          r={9}
          fill={color}
          stroke={theme.graphBackgroundColor}
        />
      );
    }
    return result;
  }

  render() {
    // console.log(`GraphSmbg: render`);

    const {
      theme,
      smbgData,
      graphScalableLayoutInfo: {
        graphFixedLayoutInfo: {
          yAxisHeightInPixels,
          yAxisPixelsPerValue,
          headerHeight,
          graphLayerHeight,
        },
        graphStartTimeSeconds,
        pixelsPerSecond,
        scaledContentWidth,
      },
    } = this.props;

    return (
      <Svg height={graphLayerHeight} width={scaledContentWidth}>
        {GraphSmbg.renderSamplesSvgElements({
          theme,
          smbgData,
          yAxisHeightInPixels,
          yAxisPixelsPerValue,
          headerHeight,
          graphStartTimeSeconds,
          pixelsPerSecond,
        })}
      </Svg>
    );
  }
}

GraphSmbg.propTypes = {
  theme: ThemePropType.isRequired,
  graphScalableLayoutInfo: PropTypes.object.isRequired,
  smbgData: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
};

export { GraphSmbg as GraphSmbgClass };
export default withTheme(GraphSmbg);
