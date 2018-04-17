/* eslint import/no-extraneous-dependencies: 0 */
import React from "react";
import { Linking } from "react-native";
import { storiesOf } from "@storybook/react-native";

import StoryContainerComponent from "../../__stories__/utils/StoryContainerComponent";
import Graph from "../../src/components/Graph/Graph";
import {
  makeYAxisLabelValues,
  makeYAxisBGBoundaryValues,
} from "../../src/components/Graph/helpers";
import Urls from "../../src/constants/Urls";
import GraphData from "../../src/models/GraphData";
import data1 from "../data/data-smbg-bolus-cbg-wizard-basal/start-2015-07-27T00-00-00.000Z-end-2015-07-28T16-00-00.000Z.json";
import data2 from "../data/data-smbg-bolus-cbg-wizard-basal/start-2015-08-11T20-00-00.000Z-end-2015-08-13T12-00-00.000Z.json";

const lowBGBoundary = 90;
const highBGBoundary = 150;

const eventTime1 = new Date("Mon Jul 27 2015 22:29:00 GMT-0500 (CDT)");
const eventTime1Seconds = eventTime1.getTime() / 1000;
const graphData1 = new GraphData();
graphData1.addResponseData(data1);
graphData1.process({
  eventTimeSeconds: eventTime1Seconds,
  timeIntervalSeconds: 60 * 60 * 12,
  lowBGBoundary,
  highBGBoundary,
});

const eventTime2 = new Date("Wed Aug 12 2015 17:40:00 GMT-0500 (CDT)");
const eventTime2Seconds = eventTime2.getTime() / 1000;
const graphData2 = new GraphData();
graphData2.addResponseData(data2);
graphData2.process({
  eventTimeSeconds: eventTime2Seconds,
  timeIntervalSeconds: 60 * 60 * 12,
  lowBGBoundary,
  highBGBoundary,
});

const isLoading = false;
const yAxisLabelValues = makeYAxisLabelValues({});
const yAxisBGBoundaryValues = makeYAxisBGBoundaryValues({});
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

storiesOf("Graph", module).add("isLoading, default scale", () => (
  <StoryContainerComponent behaviors={[]}>
    <Graph {...props} isLoading />
  </StoryContainerComponent>
));

storiesOf("Graph", module).add(
  "no data, three y-axis labels, default scale",
  () => (
    <StoryContainerComponent behaviors={[]}>
      <Graph {...props} />
    </StoryContainerComponent>
  )
);

storiesOf("Graph", module).add(
  "no data, four y-axis labels, default scale",
  () => (
    <StoryContainerComponent behaviors={[]}>
      <Graph
        {...props}
        yAxisLabelValues={makeYAxisLabelValues({
          lowBGBoundary,
          highBGBoundary,
        })}
        yAxisBGBoundaryValues={makeYAxisBGBoundaryValues({
          lowBGBoundary,
          highBGBoundary,
        })}
      />
    </StoryContainerComponent>
  )
);

storiesOf("Graph", module).add("no data, four y-axis labels, 1.0 scale", () => (
  <StoryContainerComponent behaviors={[]}>
    <Graph
      {...props}
      yAxisLabelValues={makeYAxisLabelValues({
        lowBGBoundary,
        highBGBoundary,
      })}
      yAxisBGBoundaryValues={makeYAxisBGBoundaryValues({
        lowBGBoundary,
        highBGBoundary,
      })}
      scale={1.0}
    />
  </StoryContainerComponent>
));

storiesOf("Graph", module).add("no data, four y-axis labels, max scale", () => (
  <StoryContainerComponent behaviors={[]}>
    <Graph
      {...props}
      yAxisLabelValues={makeYAxisLabelValues({
        lowBGBoundary,
        highBGBoundary,
      })}
      yAxisBGBoundaryValues={makeYAxisBGBoundaryValues({
        lowBGBoundary,
        highBGBoundary,
      })}
      scale={100.0}
    />
  </StoryContainerComponent>
));

storiesOf("Graph", module).add(
  "data 1, four y-axis labels, default scale",
  () => (
    <StoryContainerComponent behaviors={[]}>
      <Graph
        {...props}
        yAxisLabelValues={makeYAxisLabelValues({
          lowBGBoundary,
          highBGBoundary,
        })}
        yAxisBGBoundaryValues={makeYAxisBGBoundaryValues({
          lowBGBoundary,
          highBGBoundary,
        })}
        eventTime={eventTime1}
        cbgData={graphData1.cbgData}
        smbgData={graphData1.smbgData}
      />
    </StoryContainerComponent>
  )
);

storiesOf("Graph", module).add(
  "data 2, four y-axis labels, default scale",
  () => (
    <StoryContainerComponent behaviors={[]}>
      <Graph
        {...props}
        yAxisLabelValues={makeYAxisLabelValues({
          lowBGBoundary,
          highBGBoundary,
        })}
        yAxisBGBoundaryValues={makeYAxisBGBoundaryValues({
          lowBGBoundary,
          highBGBoundary,
        })}
        eventTime={eventTime2}
        cbgData={graphData2.cbgData}
        smbgData={graphData2.smbgData}
      />
    </StoryContainerComponent>
  )
);

export { makeYAxisLabelValues };
