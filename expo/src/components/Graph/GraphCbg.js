import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Svg } from "expo";
import { withTheme } from "glamorous-native";

import { ThemePropType } from "../../prop-types/theme";
import { MAX_BG_VALUE } from "./helpers";

class GraphCbg extends PureComponent {
  static renderSamplesSvgElements({
    theme,
    cbgData,
    yAxisHeightInPixels,
    yAxisPixelsPerValue,
    headerHeight,
    graphStartTimeSeconds,
    pixelsPerSecond,
  }) {
    const result = [];

    result.push(
      <Svg.Symbol
        key={result.length + 1}
        id="normal"
        viewBox="0 0 7 7"
        width="7"
        height="7"
      >
        <Svg.Circle r="3.5" fill={theme.graphBgNormalColor} stroke="none" />
      </Svg.Symbol>
    );
    result.push(
      <Svg.Symbol
        key={result.length + 1}
        id="low"
        viewBox="0 0 7 7"
        width="7"
        height="7"
      >
        <Svg.Circle r="3.5" fill={theme.graphBgLowColor} stroke="none" />
      </Svg.Symbol>
    );
    result.push(
      <Svg.Symbol
        key={result.length + 1}
        id="high"
        viewBox="0 0 7 7"
        width="7"
        height="7"
      >
        <Svg.Circle r="3.5" fill={theme.graphBgHighColor} stroke="none" />
      </Svg.Symbol>
    );

    for (let i = 0; i < cbgData.length; i += 1) {
      const { time, value, isLow, isHigh } = cbgData[i];
      let symbol = "#normal";
      if (isLow) {
        symbol = "#low";
      } else if (isHigh) {
        symbol = "#high";
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
        <Svg.Use
          key={result.length + 1}
          href={symbol}
          x={x}
          y={y}
          width="7"
          height="7"
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

export { GraphCbg as GraphCbgClass };
export default withTheme(GraphCbg);
