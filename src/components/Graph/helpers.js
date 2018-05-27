import format from "date-fns/format";
import addSeconds from "date-fns/add_seconds";

const LOW_BG_LABEL_VALUE = 40;
const HIGH_BG_LABEL_VALUE = 300;
const DEFAULT_LOW_BG_BOUNDARY_VALUE = 70;
const DEFAULT_HIGH_BG_BOUNDARY_VALUE = 180;
const MAX_BG_VALUE = 340;

const GRAPH_RENDERER_SVG = "SVG";
const GRAPH_RENDERER_THREE_JS = "Three.js (OpenGL)";

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

function calculateTimeMarkers({ graphScalableLayoutInfo }) {
  const result = {
    markerXCoordinates: [],
    markerLengths: [],
    markerLabels: [],
  };

  const {
    graphStartTimeSeconds,
    secondsPerTick,
    pixelsPerSecond,
    pixelsPerTick,
    scaledContentWidth,
  } = graphScalableLayoutInfo;
  const nextTickBoundarySeconds =
    Math.floor(graphStartTimeSeconds / secondsPerTick) * secondsPerTick;
  const timeOffset = nextTickBoundarySeconds - graphStartTimeSeconds;

  let xOffset = Math.floor(timeOffset * pixelsPerSecond);
  let currentDate = new Date(nextTickBoundarySeconds * 1000);
  do {
    let formattedDate = format(currentDate, "h:mm a");
    formattedDate = formattedDate.replace("am", "a");
    formattedDate = formattedDate.replace("pm", "p");
    formattedDate = formattedDate.replace(":00", "");
    // const isMidnight = formattedDate === "12 a"; // TODO: graph - use same midnight marker line and label treatment as Tidepool Mobile 2.x

    const markerLength = 8.0; // isMidnight ? layout.headerHeight : 8.0
    result.markerXCoordinates.push(xOffset);
    result.markerLengths.push(markerLength);
    result.markerLabels.push(formattedDate);

    currentDate = addSeconds(currentDate, secondsPerTick);
    xOffset += pixelsPerTick;
  } while (xOffset < scaledContentWidth);

  return result;
}

function calculateRelativeCenterTimeSeconds({ graphScalableLayoutInfo, x }) {
  const { secondsPerPixel, secondsInView } = graphScalableLayoutInfo;
  const scrollSeconds = x * secondsPerPixel;
  const relativeCenterTimeSeconds = scrollSeconds + secondsInView / 2;
  return relativeCenterTimeSeconds;
}

// NOTE: The relativeCenterTimeSeconds is relative to graphStartTimeSeconds (so, 0 is start of
// graph). The relativeCenterTimeSeconds can be negative (and/or greater than the end time of
// graph) during scrolling, at least on iOS
function calculateScrollXAndRelativeCenterTimeSeconds({
  graphScalableLayoutInfo,
  relativeCenterTimeSeconds, // This is the current relativeCenterTimeSeconds; this may be different in the result, if constrained (e.g. during zoom)
  isZooming,
}) {
  const {
    scaledContentWidth,
    pixelsPerSecond,
    secondsInView,
    graphFixedLayoutInfo,
  } = graphScalableLayoutInfo;
  const viewStartTimeSeconds = Math.max(
    isZooming ? 0 : relativeCenterTimeSeconds - secondsInView / 2,
    relativeCenterTimeSeconds - secondsInView / 2
  );
  const secondsToScroll = viewStartTimeSeconds;
  const scrollableContentWidth =
    scaledContentWidth - graphFixedLayoutInfo.width;
  const x = Math.min(
    isZooming ? scrollableContentWidth : pixelsPerSecond * secondsToScroll,
    pixelsPerSecond * secondsToScroll
  );
  const newRelativeCenterTimeSeconds = calculateRelativeCenterTimeSeconds({
    graphScalableLayoutInfo,
    x,
  });

  return {
    relativeCenterTimeSeconds: newRelativeCenterTimeSeconds,
    x,
  };
}

function convertHexColorStringToInt(colorString) {
  return parseInt(colorString.replace("#", "0x"), 16);
}

export {
  calculateRelativeCenterTimeSeconds,
  calculateScrollXAndRelativeCenterTimeSeconds,
  calculateTimeMarkers,
  convertHexColorStringToInt,
  makeYAxisLabelValues,
  makeYAxisBGBoundaryValues,
  DEFAULT_LOW_BG_BOUNDARY_VALUE,
  DEFAULT_HIGH_BG_BOUNDARY_VALUE,
  MAX_BG_VALUE,
  GRAPH_RENDERER_SVG,
  GRAPH_RENDERER_THREE_JS,
};
