const LOW_BG_LABEL_VALUE = 40;
const HIGH_BG_LABEL_VALUE = 300;
const DEFAULT_LOW_BG_BOUNDARY_VALUE = 70;
const DEFAULT_HIGH_BG_BOUNDARY_VALUE = 180;
const MAX_BG_VALUE = 340;

function makeYAxisLabelValues({ lowBGBoundary, highBGBoundary }) {
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

function makeYAxisBGBoundaryValues({ lowBGBoundary, highBGBoundary }) {
  return [lowBGBoundary, highBGBoundary];
}

export {
  makeYAxisLabelValues,
  makeYAxisBGBoundaryValues,
  DEFAULT_LOW_BG_BOUNDARY_VALUE,
  DEFAULT_HIGH_BG_BOUNDARY_VALUE,
  MAX_BG_VALUE,
};
