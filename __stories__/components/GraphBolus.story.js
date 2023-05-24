/* eslint import/no-extraneous-dependencies: 0 */
import React from "react";
import { Linking } from "react-native";

import StoryContainerComponent from '../utils/StoryContainerComponent';
import Graph from "../../src/components/Graph/Graph";
import {
  makeYAxisLabelValues,
  makeYAxisBGBoundaryValues,
  DEFAULT_LOW_BG_BOUNDARY_VALUE,
  DEFAULT_HIGH_BG_BOUNDARY_VALUE,
  GRAPH_RENDERER_SVG,
  GRAPH_RENDERER_THREE_JS,
} from "../../src/components/Graph/helpers";
import Urls from "../../src/constants/Urls";
import GraphData from "../../src/models/GraphData";
import data1 from "../data/data-smbg-bolus-cbg-wizard-basal/bolus/2018-01-20 interrupted extended bolus response.json";
import data2 from "../data/data-smbg-bolus-cbg-wizard-basal/bolus/2018-01-25 extended bolus with an override response.json";
import data3 from "../data/data-smbg-bolus-cbg-wizard-basal/bolus/2018-01-26 interrupted bolus followed by a bolus underride response.json";
import data4 from "../data/data-smbg-bolus-cbg-wizard-basal/bolus/2018-01-26 underride and extended bolus response.json";
import data5 from "../data/data-smbg-bolus-cbg-wizard-basal/bolus/2018-04-25 series of extended boluses response.json";
import data6 from "../data/data-smbg-bolus-cbg-wizard-basal/bolus/2018-04-26 extended bolus with override response.json";

const lowBGBoundary = 90;
const highBGBoundary = 150;
const isLoading = false;

const yAxisLabelValues = makeYAxisLabelValues({
  lowBGBoundary: DEFAULT_LOW_BG_BOUNDARY_VALUE,
  highBGBoundary: DEFAULT_HIGH_BG_BOUNDARY_VALUE,
});
const yAxisBGBoundaryValues = makeYAxisBGBoundaryValues({
  lowBGBoundary: DEFAULT_LOW_BG_BOUNDARY_VALUE,
  highBGBoundary: DEFAULT_HIGH_BG_BOUNDARY_VALUE,
});
const navigateHowToUpload = () => {
  Linking.openURL(Urls.howToUpload);
};
const onZoomStart = () => {};
const onZoomEnd = () => {};

const defaultRenderer = GRAPH_RENDERER_THREE_JS;


const Template = (args) => (
  <StoryContainerComponent behaviors={[]}>
    <Graph {...args} />
  </StoryContainerComponent>
);

const processData = (eventTime, graphDataResponseJson) => {
  const eventTimeSeconds = eventTime.getTime() / 1000;
  const graphData = new GraphData();
  graphData.addResponseData(graphDataResponseJson);
  graphData.process({
    eventTimeSeconds,
    timeIntervalSeconds: 60 * 60 * 12,
    lowBGBoundary,
    highBGBoundary,
  });

  return {
    eventTime,
    cbgData: graphData.cbgData,
    smbgData: graphData.smbgData,
    basalData: graphData.basalData,
    maxBasalValue: graphData.maxBasalValue,
    bolusData: graphData.bolusData,
    maxBolusValue: graphData.maxBolusValue,
    minBolusScaleValue: graphData.minBolusScaleValue,
    wizardData: graphData.wizardData,
  };
}

const commonProps = {
  isLoading,
  yAxisLabelValues,
  yAxisBGBoundaryValues,
  navigateHowToUpload,
  onZoomStart,
  onZoomEnd,
  graphRenderer: defaultRenderer,
};

export const InterruptedExtendedBolus = Template.bind({});
InterruptedExtendedBolus.args = {
  ...commonProps,
  ...processData(new Date("Mon Jan 20 2018 04:22:00 GMT-0500 (CDT)"), data1),
};

export const ExtendedBolusOverride = Template.bind({});
ExtendedBolusOverride.args = {
  ...commonProps,
  ...processData(new Date("Mon Jan 25 2018 20:16:00 GMT-0500 (CDT)"), data2),
};

export const InterruptedBolusFollowedByUnderride = Template.bind({});
InterruptedBolusFollowedByUnderride.args = {
  ...commonProps,
  ...processData(new Date("Mon Jan 26 2018 10:50:00 GMT-0500 (CDT)"), data3),
};


export const UnderrideAndExtendedBolus = Template.bind({});
UnderrideAndExtendedBolus.args = {
  ...commonProps,
  ...processData(new Date("Mon Jan 26 2018 12:30:00 GMT-0500 (CDT)"), data4),
};

export const SeriesOfExtendedBoluses = Template.bind({});
SeriesOfExtendedBoluses.args = {
  ...commonProps,
  ...processData(new Date("Mon Apr 25 2018 14:48:00 GMT-0500 (CDT)"), data5),
};

export const ExtendedBolusWithOverride = Template.bind({});
ExtendedBolusWithOverride.args = {
  ...commonProps,
  ...processData(new Date("Mon Apr 26 2018 00:10:00 GMT-0500 (CDT)"), data6),
};


export default {
  title: 'Graph',
  component: Graph,
  argTypes: {
    graphRenderer: {
      control: {
        type: 'select',
        options: [GRAPH_RENDERER_THREE_JS, GRAPH_RENDERER_SVG],
      },
    },
  },
};