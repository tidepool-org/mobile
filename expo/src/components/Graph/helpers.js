const LOW_BG_LABEL_VALUE = 40;
const HIGH_BG_LABEL_VALUE = 300;
const DEFAULT_LOW_BG_BOUNDARY_VALUE = 70;
const DEFAULT_HIGH_BG_BOUNDARY_VALUE = 180;
const MAX_BG_VALUE = 340;

function makeYAxisLabelValues({
  lowBGBoundary = DEFAULT_LOW_BG_BOUNDARY_VALUE,
  highBGBoundary = DEFAULT_HIGH_BG_BOUNDARY_VALUE,
}) {
  if (lowBGBoundary - LOW_BG_LABEL_VALUE >= LOW_BG_LABEL_VALUE) {
    return [
      LOW_BG_LABEL_VALUE,
      lowBGBoundary,
      highBGBoundary,
      HIGH_BG_LABEL_VALUE,
    ];
  }
  return [lowBGBoundary, highBGBoundary, HIGH_BG_LABEL_VALUE];
}

function makeYAxisBGBoundaryValues({
  lowBGBoundary = DEFAULT_LOW_BG_BOUNDARY_VALUE,
  highBGBoundary = DEFAULT_HIGH_BG_BOUNDARY_VALUE,
}) {
  return [lowBGBoundary, highBGBoundary];
}

export { makeYAxisLabelValues, makeYAxisBGBoundaryValues, MAX_BG_VALUE };
