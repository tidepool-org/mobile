import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { withTheme } from "glamorous-native";

import { Svg, Path } from "../../svg-exports";
import { ThemePropType } from "../../prop-types/theme";

class GraphYAxisBGBoundaryLines extends PureComponent {
  renderBGBoundaryLine(value) {
    const {
      theme,
      graphFixedLayoutInfo: { yAxisHeightInPixels, yAxisPixelsPerValue, width },
    } = this.props;

    const yOffset = Math.round(
      yAxisHeightInPixels - value * yAxisPixelsPerValue
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
    // console.log("GraphYAxisBGBoundaryLines: render");

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

GraphYAxisBGBoundaryLines.propTypes = {
  theme: ThemePropType.isRequired,
  yAxisBGBoundaryValues: PropTypes.arrayOf(PropTypes.number.isRequired)
    .isRequired,
  graphFixedLayoutInfo: PropTypes.object.isRequired,
};

export default withTheme(GraphYAxisBGBoundaryLines);
