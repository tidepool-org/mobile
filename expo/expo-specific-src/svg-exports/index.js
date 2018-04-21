// This svg-exports/index.js is a helper to deal with difference between Expo and react-native-svg
// in how the various Svg elements are exported. The correct version (for either expo or ejected
// app) is copied into place via build script.

import { Svg } from "expo";

const { Circle, Path, Polygon, Symbol, Text, Use } = Svg;

export { Svg, Circle, Path, Polygon, Symbol, Text, Use };
