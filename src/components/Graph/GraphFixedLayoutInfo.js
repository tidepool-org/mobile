// TODO: graph - parameterize this more like Tidepool Mobile?
class GraphFixedLayoutInfo {
  constructor({ height = 180, width = 0, headerHeight = 24 }) {
    // console.log('GraphFixedLayoutInfo: ctor')

    this.yAxisHeightInPixels = 98;
    this.yAxisValueRange = 340;
    this.yAxisPixelsPerValue = this.yAxisHeightInPixels / this.yAxisValueRange;
    this.yAxisLabelTextHeight = 18;
    this.yAxisLabelTextHalfHeight = this.yAxisLabelTextHeight / 2;

    this.height = height;
    this.width = width;
    this.headerHeight = headerHeight;
    this.graphLayerHeight = this.height - this.headerHeight;
  }
}

export default GraphFixedLayoutInfo;
