import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Svg } from "expo";
import glamorous, { withTheme } from "glamorous-native";

import { ThemePropType } from "../../prop-types/theme";
import { MAX_BG_VALUE } from "./helpers";

class GraphCbg extends PureComponent {
  renderSample({ key, x, y, isLow, isHigh }) {
    const { theme } = this.props;
    const radius = 3.5;
    let color = theme.graphBgNormalColor;
    if (isLow) {
      color = theme.graphBgLowColor;
    } else if (isHigh) {
      color = theme.graphBgHighColor;
    }

    return (
      <Svg.Circle
        key={key}
        cx={x}
        cy={y}
        r={radius}
        fill={color}
        stroke="none"
      />
    );
  }

  renderSamples() {
    const { cbgData } = this.props;
    const {
      graphScalableLayoutInfo: {
        graphFixedLayoutInfo: {
          yAxisHeightInPixels,
          yAxisPixelsPerValue,
          headerHeight,
        },
        graphStartTimeSeconds,
        pixelsPerSecond,
      },
    } = this.props;

    const result = new Array(cbgData.length);
    for (let i = 0; i < cbgData.length; i += 1) {
      const { time, value, isLow, isHigh } = cbgData[i];
      const constrainedValue = Math.min(value, MAX_BG_VALUE);
      const deltaTime = time - graphStartTimeSeconds;
      const x = deltaTime * pixelsPerSecond;
      const y =
        headerHeight +
        Math.round(
          yAxisHeightInPixels - constrainedValue * yAxisPixelsPerValue
        );
      result.push(this.renderSample({ key: i, x, y, isLow, isHigh }));
    }
    return result;
  }

  render() {
    // console.log(`GraphCbg: render`);

    const {
      graphFixedLayoutInfo: { graphLayerHeight },
      scaledContentWidth,
    } = this.props.graphScalableLayoutInfo;

    return (
      <glamorous.View
        position="absolute"
        pointerEvents="none"
        backgroundColor="transparent"
      >
        <Svg height={graphLayerHeight} width={scaledContentWidth}>
          {this.renderSamples()}
        </Svg>
      </glamorous.View>
    );
  }
}

GraphCbg.propTypes = {
  theme: ThemePropType.isRequired,
  graphScalableLayoutInfo: PropTypes.object.isRequired,
  cbgData: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
};

export default withTheme(GraphCbg);
