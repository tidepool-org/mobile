const LOW_BG_LABEL_VALUE = 40;
const HIGH_BG_LABEL_VALUE = 300;
const DEFAULT_LOW_BG_BOUNDARY_VALUE = 70;
const DEFAULT_HIGH_BG_BOUNDARY_VALUE = 180;

function makeYAxisLabelValues({
  low = DEFAULT_LOW_BG_BOUNDARY_VALUE,
  high = DEFAULT_HIGH_BG_BOUNDARY_VALUE,
}) {
  if (low - LOW_BG_LABEL_VALUE >= LOW_BG_LABEL_VALUE) {
    return [LOW_BG_LABEL_VALUE, low, high, HIGH_BG_LABEL_VALUE];
  }
  return [low, high, HIGH_BG_LABEL_VALUE];
}

function makeYAxisBGBoundaryValues({
  low = DEFAULT_LOW_BG_BOUNDARY_VALUE,
  high = DEFAULT_HIGH_BG_BOUNDARY_VALUE,
}) {
  return [low, high];
}

export { makeYAxisLabelValues, makeYAxisBGBoundaryValues };
