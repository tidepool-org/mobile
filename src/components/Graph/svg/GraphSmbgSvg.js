import React from "react";
import { Svg } from "expo";

import { MAX_BG_VALUE } from "../helpers";

const { Circle, Text } = Svg;

class GraphSmbgSvg {
  static render({
    theme,
    smbgData,
    yAxisGlucosePixelsPerValue,
    yAxisBottomOfGlucose,
    graphStartTimeSeconds,
    graphEndTimeSeconds,
    pixelsPerSecond,
  }) {
    const result = new Array(smbgData.length);
    for (let i = 0; i < smbgData.length; i += 1) {
      const { time, value, isLow, isHigh } = smbgData[i];
      if (time >= graphStartTimeSeconds && time <= graphEndTimeSeconds) {
        let color = theme.graphBgNormalColor;
        if (isLow) {
          color = theme.graphBgLowColor;
        } else if (isHigh) {
          color = theme.graphBgHighColor;
        }
        const constrainedValue = Math.min(value, MAX_BG_VALUE);
        const timeOffset = time - graphStartTimeSeconds;
        const x = timeOffset * pixelsPerSecond;
        const y = Math.round(
          yAxisBottomOfGlucose - constrainedValue * yAxisGlucosePixelsPerValue
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
          const nextTimeOffset = nextTime - graphStartTimeSeconds;
          const nextX = nextTimeOffset * pixelsPerSecond;
          const nextY = Math.round(
            yAxisBottomOfGlucose -
              nextConstrainedValue * yAxisGlucosePixelsPerValue
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
    }
    return result;
  }
}
export default GraphSmbgSvg;
