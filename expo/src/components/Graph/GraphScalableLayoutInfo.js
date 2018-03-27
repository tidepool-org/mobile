import addSeconds from "date-fns/add_seconds";
import subSeconds from "date-fns/sub_seconds";

// TODO: graph - ideally use same zoom level when editing the note?? .. persist it in the state tree
// TODO: graph - only load/render data that is visible based on scroll position? Consider tiling views like Tidepool Mobile 2.x did?

class GraphScalableLayoutInfo {
  constructor({
    eventTime = new Date(),
    timeIntervalSeconds = 12 * 60 * 60, // 12 hours
    scale = 12.0 / 4.0, // 12 hours / 4 hours,
    minScale = 1.0,
    maxScale = 12.0 / 1.0, // 12 hours / 1 hour
    graphFixedLayoutInfo,
  }) {
    this.eventTime = eventTime;
    this.startTime = subSeconds(eventTime, timeIntervalSeconds / 2);
    this.endTime = addSeconds(eventTime, timeIntervalSeconds / 2);
    this.timeIntervalSeconds = timeIntervalSeconds;
    this.graphFixedLayoutInfo = graphFixedLayoutInfo;

    this.scale = Math.max(Math.min(scale, maxScale), minScale);
    this.scaledContentWidth = Math.round(
      this.scale * graphFixedLayoutInfo.width
    );
    this.pixelsPerSecond = this.scaledContentWidth / this.timeIntervalSeconds;
  }
}

export default GraphScalableLayoutInfo;
