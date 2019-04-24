import { UNITS_MG_PER_DL, MAX_BG_VALUE } from "./helpers";

class GraphLayoutConstantsClass {
  constructor() {
    this.height = 210;
    this.headerHeight = 24.0;
    this.graphLayerHeight = this.height - this.headerHeight;

    const graphWizardHeight = 27.0;
    const graphGlucoseBaseOffset = 22.0;
    const graphWizardBaseOffset = 2.0;
    const graphFractionForGlucose = 0.65;
    const remainingHeight =
      this.height -
      this.headerHeight -
      graphWizardHeight -
      graphGlucoseBaseOffset -
      graphWizardBaseOffset;

    // The largest section is for the glucose readings just below the header
    this.yAxisTopOfGlucose = this.headerHeight;
    this.yAxisBottomOfGlucose =
      this.yAxisTopOfGlucose +
      Math.floor(graphFractionForGlucose * remainingHeight);
    this.yAxisGlucoseHeight =
      this.yAxisBottomOfGlucose - this.yAxisTopOfGlucose;
    this.yAxisGlucosePixelsPerValue = this.yAxisGlucoseHeight / MAX_BG_VALUE;

    // Wizard data sits above the bolus readings, in a fixed space area.
    this.yAxisBottomOfWizard =
      this.yAxisBottomOfGlucose + graphWizardHeight + graphGlucoseBaseOffset;
    this.wizardRadius = (graphWizardHeight - 1) / 2;

    // At the bottom are the bolus and basal readings
    this.yAxisTopOfBolus = this.yAxisBottomOfWizard + graphWizardBaseOffset;
    this.yAxisBottomOfBolus = this.height;
    this.yAxisBolusHeight = this.yAxisBottomOfBolus - this.yAxisTopOfBolus;

    // Basal values sit just below the bolus readings
    this.yAxisBottomOfBasal = this.yAxisBottomOfBolus;
    this.yAxisBasalHeight = Math.ceil(this.yAxisBolusHeight / 2);
    this.yAxisTopOfBasal = this.yAxisTopOfBolus - this.yAxisBasalHeight;

    // Y-axis tracks the glucose readings
    this.yAxisLineLeftMargin = 35.0;
    this.yAxisLineRightMargin = 10.0;
    const yAxisGlucoseLabelTextHeight = 18;
    this.yAxisGlucoseLabelTextHalfHeight = yAxisGlucoseLabelTextHeight / 2;

    // Note time indicator line
    this.yTopOfNote = 0.0;
    this.yBottomOfNote = this.height;
  }
}

const GraphLayoutConstants = new GraphLayoutConstantsClass();

class GraphFixedLayoutInfo {
  constructor({ width = 0, units }) {
    // console.log('GraphFixedLayoutInfo: ctor')

    this.width = width;
    this.units = units || UNITS_MG_PER_DL;

    Object.assign(this, { ...GraphLayoutConstants });
  }
}

export { GraphFixedLayoutInfo, GraphLayoutConstants };
