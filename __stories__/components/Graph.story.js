/* eslint import/no-extraneous-dependencies: 0 */
import React from 'react';
import { Linking } from 'react-native';

import StoryContainerComponent from '../utils/StoryContainerComponent';
import Graph from '../../src/components/Graph/Graph';
import {
  makeYAxisLabelValues,
  makeYAxisBGBoundaryValues,
  DEFAULT_LOW_BG_BOUNDARY_VALUE,
  DEFAULT_HIGH_BG_BOUNDARY_VALUE,
  GRAPH_RENDERER_SVG,
  GRAPH_RENDERER_THREE_JS,
} from '../../src/components/Graph/helpers';
import Urls from '../../src/constants/Urls';
import GraphData from '../../src/models/GraphData';
import data1 from '../data/data-smbg-bolus-cbg-wizard-basal/start-2015-07-27T00-00-00.000Z-end-2015-07-28T16-00-00.000Z.json';
import data2 from '../data/data-smbg-bolus-cbg-wizard-basal/start-2015-08-11T20-00-00.000Z-end-2015-08-13T12-00-00.000Z.json';

const lowBGBoundary = 90;
const highBGBoundary = 150;
const isLoading = false;

const eventTime1 = new Date('Mon Jul 27 2015 22:29:00 GMT-0500 (CDT)');
const eventTime1Seconds = eventTime1.getTime() / 1000;
const graphData1 = new GraphData();
graphData1.addResponseData(data1);
graphData1.process({
  eventTimeSeconds: eventTime1Seconds,
  timeIntervalSeconds: 60 * 60 * 12,
  lowBGBoundary,
  highBGBoundary,
});

const eventTime2 = new Date('Wed Aug 12 2015 17:40:00 GMT-0500 (CDT)');
const eventTime2Seconds = eventTime2.getTime() / 1000;
const graphData2 = new GraphData();
graphData2.addResponseData(data2);
graphData2.process({
  eventTimeSeconds: eventTime2Seconds,
  timeIntervalSeconds: 60 * 60 * 12,
  lowBGBoundary,
  highBGBoundary,
});

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

const props = {
  isLoading,
  yAxisLabelValues,
  yAxisBGBoundaryValues,
  navigateHowToUpload,
  onZoomStart,
  onZoomEnd,
};

const defaultRenderer = GRAPH_RENDERER_THREE_JS;

const Template = (args) => (
  <StoryContainerComponent behaviors={[]}>
    <Graph {...args} />
  </StoryContainerComponent>
);

export const OfflineNotAvailableOffline = Template.bind({});
OfflineNotAvailableOffline.args = {
  ...props,
  isOffline: true,
  isAvailableOffline: false,
  graphRenderer: defaultRenderer,
};

export const OfflineAvailableOffline = Template.bind({});
OfflineAvailableOffline.args = {
  ...props,
  isOffline: true,
  isAvailableOffline: true,
  graphRenderer: defaultRenderer,
};

export const IsLoadingDefaultScale = Template.bind({});
IsLoadingDefaultScale.args = {
  ...props,
  isLoading: true,
  graphRenderer: defaultRenderer,
};

export const NoDataThreeYAxisLabelsDefaultScale = Template.bind({});
NoDataThreeYAxisLabelsDefaultScale.args = {
  ...props,
  graphRenderer: defaultRenderer,
};

export const NoDataFourYAxisLabelsDefaultScale = Template.bind({});
NoDataFourYAxisLabelsDefaultScale.args = {
  ...props,
  yAxisLabelValues: makeYAxisLabelValues({
    lowBGBoundary,
    highBGBoundary,
  }),
  yAxisBGBoundaryValues: makeYAxisBGBoundaryValues({
    lowBGBoundary,
    highBGBoundary,
  }),
  graphRenderer: defaultRenderer,
};

export const NoDataFourYAxisLabels10Scale = Template.bind({});
NoDataFourYAxisLabels10Scale.args = {
  ...props,
  yAxisLabelValues: makeYAxisLabelValues({
    lowBGBoundary,
    highBGBoundary,
  }),
  yAxisBGBoundaryValues: makeYAxisBGBoundaryValues({
    lowBGBoundary,
    highBGBoundary,
  }),
  scale: 1.0,
  graphRenderer: defaultRenderer,
};

export const NoDataFourYAxisLabelsMaxScale = Template.bind({});
NoDataFourYAxisLabelsMaxScale.args = {
  ...props,
  yAxisLabelValues: makeYAxisLabelValues({
    lowBGBoundary,
    highBGBoundary,
  }),
  yAxisBGBoundaryValues: makeYAxisBGBoundaryValues({
    lowBGBoundary,
    highBGBoundary,
  }),
  scale: 100.0,
  graphRenderer: defaultRenderer,
};


export const Data1ThreeYAxisLabelsDefaultScale = Template.bind({});
Data1ThreeYAxisLabelsDefaultScale.args = {
  ...props,
  eventTime: eventTime1,
  cbgData: graphData1.cbgData,
  smbgData: graphData1.smbgData,
  basalData: graphData1.basalData,
  maxBasalValue: graphData1.maxBasalValue,
  bolusData: graphData1.bolusData,
  maxBolusValue: graphData1.maxBolusValue,
  minBolusScaleValue: graphData1.minBolusScaleValue,
  wizardData: graphData1.wizardData,
  graphRenderer: defaultRenderer,
};

export const Data1FourYAxisLabelsDefaultScale = Template.bind({});
Data1FourYAxisLabelsDefaultScale.args = {
  ...props,
  yAxisLabelValues: makeYAxisLabelValues({
    lowBGBoundary,
    highBGBoundary,
  }),
  yAxisBGBoundaryValues: makeYAxisBGBoundaryValues({
    lowBGBoundary,
    highBGBoundary,
  }),
  eventTime: eventTime1,
  cbgData: graphData1.cbgData,
  smbgData: graphData1.smbgData,
  basalData: graphData1.basalData,
  maxBasalValue: graphData1.maxBasalValue,
  bolusData: graphData1.bolusData,
  maxBolusValue: graphData1.maxBolusValue,
  minBolusScaleValue: graphData1.minBolusScaleValue,
  wizardData: graphData1.wizardData,
  graphRenderer: defaultRenderer,
};

export const Data1FourYAxisLabels10Scale = Template.bind({});
Data1FourYAxisLabels10Scale.args = {
  ...props,
  yAxisLabelValues: makeYAxisLabelValues({
    lowBGBoundary,
    highBGBoundary,
  }),
  yAxisBGBoundaryValues: makeYAxisBGBoundaryValues({
    lowBGBoundary,
    highBGBoundary,
  }),
  eventTime: eventTime1,
  cbgData: graphData1.cbgData,
  smbgData: graphData1.smbgData,
  basalData: graphData1.basalData,
  maxBasalValue: graphData1.maxBasalValue,
  bolusData: graphData1.bolusData,
  maxBolusValue: graphData1.maxBolusValue,
  minBolusScaleValue: graphData1.minBolusScaleValue,
  wizardData: graphData1.wizardData,
  scale: 1.0,
  graphRenderer: defaultRenderer,
};

export const Data1FourYAxisLabelsMaxScale = Template.bind({});
Data1FourYAxisLabelsMaxScale.args = {
  ...props,
  yAxisLabelValues: makeYAxisLabelValues({
    lowBGBoundary,
    highBGBoundary,
  }),
  yAxisBGBoundaryValues: makeYAxisBGBoundaryValues({
    lowBGBoundary,
    highBGBoundary,
  }),
  eventTime: eventTime1,
  cbgData: graphData1.cbgData,
  smbgData: graphData1.smbgData,
  basalData: graphData1.basalData,
  maxBasalValue: graphData1.maxBasalValue,
  bolusData: graphData1.bolusData,
  maxBolusValue: graphData1.maxBolusValue,
  minBolusScaleValue: graphData1.minBolusScaleValue,
  wizardData: graphData1.wizardData,
  scale: 100.0,
  graphRenderer: defaultRenderer,
};

export const Data2FourYAxisLabelsDefaultScale = Template.bind({});
Data2FourYAxisLabelsDefaultScale.args = {
  ...props,
  yAxisLabelValues: makeYAxisLabelValues({
    lowBGBoundary,
    highBGBoundary,
  }),
  yAxisBGBoundaryValues: makeYAxisBGBoundaryValues({
    lowBGBoundary,
    highBGBoundary,
  }),
  eventTime: eventTime2,
  cbgData: graphData2.cbgData,
  smbgData: graphData2.smbgData,
  basalData: graphData2.basalData,
  maxBasalValue: graphData2.maxBasalValue,
  bolusData: graphData2.bolusData,
  maxBolusValue: graphData2.maxBolusValue,
  minBolusScaleValue: graphData2.minBolusScaleValue,
  wizardData: graphData2.wizardData,
  graphRenderer: defaultRenderer,
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
