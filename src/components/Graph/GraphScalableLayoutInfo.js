import subSeconds from "date-fns/sub_seconds";

// TODO: graph - perf - Only load/render data that is visible based on scroll position? Consider tiling views like Tidepool Mobile 2.x did?
// TODO: graph - perf - Consider skipping rendering of CBG data points that intersect at certain scales?
// TODO: graph - Offscreen labels render fine, and are revealed when user tries to scroll beyond bounds, but, the tick marks are clipped / not rendered

class GraphScalableLayoutInfo {
  constructor({
    eventTime = GraphScalableLayoutInfo.defaultProps.eventTime,
    timeIntervalSeconds = GraphScalableLayoutInfo.defaultProps
      .timeIntervalSeconds,
    scale = GraphScalableLayoutInfo.defaultProps.scale,
    graphFixedLayoutInfo,
  }) {
    // console.log('GraphScalableLayoutInfo: ctor')

    this.eventTime = eventTime;
    this.eventTimeSeconds = this.eventTime.getTime() / 1000;
    this.graphStartTime = subSeconds(eventTime, timeIntervalSeconds / 2);
    this.graphStartTimeSeconds = this.graphStartTime.getTime() / 1000;
    this.graphEndTimeSeconds = this.graphStartTimeSeconds + timeIntervalSeconds;
    this.timeIntervalSeconds = timeIntervalSeconds;
    this.graphFixedLayoutInfo = graphFixedLayoutInfo;

    // Constrain scale
    const minScale = 1.0;
    const maxScale = 12;
    let constrainedScale = Math.max(Math.min(scale, maxScale), minScale);
    let scaledContentWidth = Math.round(
      constrainedScale * graphFixedLayoutInfo.width
    );
    const maxScaledContentWidth = Math.min(
      12 * graphFixedLayoutInfo.width,
      4000.0
    );
    scaledContentWidth = Math.min(scaledContentWidth, maxScaledContentWidth);
    if (graphFixedLayoutInfo.width > 0) {
      constrainedScale = scaledContentWidth / graphFixedLayoutInfo.width;
      constrainedScale = Math.max(
        Math.min(constrainedScale, maxScale),
        minScale
      );
      scaledContentWidth = Math.round(
        constrainedScale * graphFixedLayoutInfo.width
      );
    }

    this.scale = constrainedScale;
    this.scaledContentWidth = Math.round(
      constrainedScale * graphFixedLayoutInfo.width
    );

    this.secondsPerPixel = this.timeIntervalSeconds / this.scaledContentWidth;
    this.secondsInGraph = this.secondsPerPixel * this.scaledContentWidth;
    this.secondsInView = this.secondsPerPixel * graphFixedLayoutInfo.width;
    this.pixelsPerSecond = this.scaledContentWidth / this.timeIntervalSeconds;
    const {
      secondsPerTick,
      pixelsPerTick,
      ticksInGraph,
    } = this.calculateTicks();
    this.secondsPerTick = secondsPerTick;
    this.pixelsPerTick = pixelsPerTick;
    this.ticksInGraph = ticksInGraph;
  }

  calculateTicks() {
    const result = {
      secondsPerTick: 0,
      pixelsPerTick: 0,
      ticksInGraph: 0,
    };

    const secondsPerTickArray = [
      15 * 60,
      30 * 60,
      60 * 60,
      2 * 60 * 60,
      4 * 60 * 60,
      8 * 60 * 60,
    ];
    const maxPixelsPerTick = 100;
    for (let i = 0; i < secondsPerTickArray.length; i += 1) {
      const secondsPerTick = secondsPerTickArray[i];
      const ticksInGraph = this.secondsInGraph / secondsPerTick;
      const pixelsPerTick = this.scaledContentWidth / ticksInGraph;
      if (pixelsPerTick > maxPixelsPerTick) {
        break;
      }
      result.secondsPerTick = secondsPerTick;
      result.pixelsPerTick = secondsPerTick * this.pixelsPerSecond;
      result.ticksInGraph = ticksInGraph;
    }

    return result;
  }
}

GraphScalableLayoutInfo.defaultProps = {
  eventTime: new Date(),
  timeIntervalSeconds: 12 * 60 * 60, // 12 hours
  scale: 2.5,
};

export default GraphScalableLayoutInfo;
