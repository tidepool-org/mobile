import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Svg } from "expo";
import { withTheme } from "glamorous-native";

import { ThemePropType } from "../../prop-types/theme";
import { MAX_BG_VALUE } from "./helpers";

export class GraphCbg extends PureComponent {
  static renderSamplesSvgElements({
    theme,
    cbgData,
    yAxisHeightInPixels,
    yAxisPixelsPerValue,
    headerHeight,
    graphStartTimeSeconds,
    pixelsPerSecond,
  }) {
    const result = new Array(cbgData.length);
    const radius = 3.5;
    for (let i = 0; i < cbgData.length; i += 1) {
      const { time, value, isLow, isHigh } = cbgData[i];
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

      result.push(
        <Svg.Circle
          key={i}
          cx={x}
          cy={y}
          r={radius}
          fill={color}
          stroke="none"
        />
      );
    }

    return result;
  }

  render() {
    // console.log(`GraphCbg: render`);

    const {
      theme,
      cbgData,
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
        {GraphCbg.renderSamplesSvgElements({
          theme,
          cbgData,
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

GraphCbg.propTypes = {
  theme: ThemePropType.isRequired,
  graphScalableLayoutInfo: PropTypes.object.isRequired,
  cbgData: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
};

export default withTheme(GraphCbg);
