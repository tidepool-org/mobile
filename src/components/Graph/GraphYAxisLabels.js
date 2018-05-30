import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import glamorous, { withTheme } from "glamorous-native";

import { ThemePropType } from "../../prop-types/theme";

class GraphYAxisLabels extends PureComponent {
  renderLabel(value) {
    const {
      theme,
      graphFixedLayoutInfo: {
        yAxisGlucoseLabelTextHalfHeight,
        yAxisGlucoseHeight,
        yAxisGlucosePixelsPerValue,
      },
    } = this.props;

    const yOffset = Math.round(
      yAxisGlucoseHeight - value * yAxisGlucosePixelsPerValue
    );

    return (
      <glamorous.Text
        key={value}
        allowFontScaling={false}
        position="absolute"
        pointerEvents="none"
        style={theme.graphYAxisLabelStyle}
        width={25}
        textAlign="right"
        top={yOffset - yAxisGlucoseLabelTextHalfHeight}
      >
        {value}
      </glamorous.Text>
    );
  }

  render() {
    // console.log("GraphYAxisLabels: render");

    const { yAxisLabelValues } = this.props;

    return (
      <glamorous.View>
        {yAxisLabelValues.map(value => this.renderLabel(value))}
      </glamorous.View>
    );
  }
}

GraphYAxisLabels.propTypes = {
  theme: ThemePropType.isRequired,
  yAxisLabelValues: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired,
  graphFixedLayoutInfo: PropTypes.object.isRequired,
};

export default withTheme(GraphYAxisLabels);
