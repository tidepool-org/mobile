import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { ViewPropTypes } from "react-native";
import glamorous from "glamorous-native";

import PrimaryTheme from "../../themes/PrimaryTheme";

class SimpleTextTooltipContent extends PureComponent {
  theme = PrimaryTheme;

  render() {
    const { text, containerStyle } = this.props;
    const defaultContainerStyle = [
      {
        padding: 8,
      },
    ];

    return (
      <glamorous.View style={[defaultContainerStyle, containerStyle]}>
        <glamorous.Text
          allowFontScaling={false}
          style={this.theme.toolTipContentTextStyle}
        >
          {text}
        </glamorous.Text>
      </glamorous.View>
    );
  }
}

SimpleTextTooltipContent.propTypes = {
  text: PropTypes.string.isRequired,
  containerStyle: ViewPropTypes.style,
};

SimpleTextTooltipContent.defaultProps = {
  containerStyle: null,
};

export default SimpleTextTooltipContent;
