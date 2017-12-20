// NOTE: This file is copied via build script to src/components/LinearGradient.js

import React from "react";
import PropTypes from "prop-types";
import { ViewPropTypes } from "react-native";
import LinearGradient from "react-native-linear-gradient";

const LinearGradientReactNative = ({ style, colors }) => (
  <LinearGradient style={style} colors={colors} />
);

LinearGradientReactNative.propTypes = {
  style: ViewPropTypes.style,
  colors: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
};

LinearGradientReactNative.defaultProps = {
  style: null,
};

export default LinearGradientReactNative;
