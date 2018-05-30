import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { withTheme } from "glamorous-native";
import { Svg } from "expo";

import { ThemePropType } from "../../../prop-types/theme";

const { Path } = Svg;

class GraphYAxisBGBoundaryLinesSvg extends PureComponent {
  renderBGBoundaryLine(value) {
    const {
      theme,
      graphFixedLayoutInfo: { yAxisGlucoseHeight, yAxisGlucosePixelsPerValue, width },
    } = this.props;

    const yOffset = Math.round(
      yAxisGlucoseHeight - value * yAxisGlucosePixelsPerValue
    );

    const x1 = 30;
    const x2 = width - 4;
    const y = yOffset;
    const d = `M${x1} ${y} L${x2} ${y}`;

    return (
      <Path
        key={value}
        d={d}
        stroke={theme.graphLineStrokeColor}
        strokeDasharray="2, 5"
        strokeLinecap="square"
        strokeLineJoin="round"
        strokeWidth="1.5"
      />
    );
  }

  render() {
    // console.log("GraphYAxisBGBoundaryLinesSvg: render");

    const {
      yAxisBGBoundaryValues,
      graphFixedLayoutInfo: { width, graphLayerHeight },
    } = this.props;

    return (
      <Svg height={graphLayerHeight} width={width}>
        {yAxisBGBoundaryValues.map(value => this.renderBGBoundaryLine(value))}
      </Svg>
    );
  }
}

GraphYAxisBGBoundaryLinesSvg.propTypes = {
  theme: ThemePropType.isRequired,
  yAxisBGBoundaryValues: PropTypes.arrayOf(PropTypes.number.isRequired)
    .isRequired,
  graphFixedLayoutInfo: PropTypes.object.isRequired,
};

export default withTheme(GraphYAxisBGBoundaryLinesSvg);
