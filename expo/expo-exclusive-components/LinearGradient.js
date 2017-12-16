import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { ViewPropTypes } from "react-native";
import { LinearGradient } from "expo";

class LinearGradientExpo extends PureComponent {
  render() {
    const { style, colors } = this.props;

    return <LinearGradient style={style} colors={colors} />;
  }
}

LinearGradientExpo.propTypes = {
  style: ViewPropTypes.style,
  colors: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
};

LinearGradientExpo.defaultProps = {
  style: null,
};

export default LinearGradientExpo;
