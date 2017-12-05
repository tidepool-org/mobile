import React from "react";
import PropTypes from "prop-types";
import { ViewPropTypes } from "react-native";
import { LinearGradient } from "expo";

const LinearGradientExpo = ({ style, colors }) => (
  <LinearGradient style={style} colors={colors} />
);

LinearGradientExpo.propTypes = {
  style: ViewPropTypes.style,
  colors: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
};

LinearGradientExpo.defaultProps = {
  style: null,
};

export default LinearGradientExpo;
