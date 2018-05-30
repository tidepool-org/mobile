// TODO: graph - parameterize this more like Tidepool Mobile?
class GraphFixedLayoutInfo {
  constructor({ width = 0 }) {
    // console.log('GraphFixedLayoutInfo: ctor')

    this.width = width;
    this.height = 180;
    this.headerHeight = 24;
    this.footerHeight = 8;
    this.graphLayerHeight = this.height - this.headerHeight;

    // The largest section is for the glucose readings just below the header
    const glucoseRange = 340;
    this.yAxisGlucoseHeight = 98;
    this.yAxisGlucosePixelsPerValue = this.yAxisGlucoseHeight / glucoseRange;
    const yAxisGlucoseLabelTextHeight = 18;
    this.yAxisGlucoseLabelTextHalfHeight = yAxisGlucoseLabelTextHeight / 2;
    this.yAxisTopOfGlucose = this.headerHeight;
    this.yAxisBottomOfGlucose =
      this.yAxisTopOfGlucose + this.yAxisGlucoseHeight;

    // Wizard data sits above the bolus readings, in a fixed space area, possibly overlapping the
    // bottom of the glucose graph which should be empty of readings that low.
    this.yAxisBottomOfWizard = this.yAxisBottomOfGlucose;

    // At the bottom are the bolus and basal readings
    this.yAxisTopOfBolus = this.yAxisBottomOfWizard + 2;
    this.yAxisBottomOfBolus = this.height - this.footerHeight;
    this.yAxisBolusHeight = this.yAxisBottomOfBolus - this.yAxisTopOfBolus;

    // Basal values sit just below the bolus readings
    this.yAxisBottomOfBasal = this.yAxisBottomOfBolus;
    this.yAxisBasalHeight = Math.ceil(this.yAxisBolusHeight / 2);
    this.yAxisTopOfBasal = this.yAxisTopOfBolus - this.yAxisBasalHeight;
  }
}

export default GraphFixedLayoutInfo;
