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

const loading = false;
const yAxisLabelValues = makeYAxisLabelValues({});
const yAxisBGBoundaryValues = makeYAxisBGBoundaryValues({});
const navigateHowToUpload = () => {
  Linking.openURL(Urls.howToUpload);
};
const props = {
  loading,
  yAxisLabelValues,
  yAxisBGBoundaryValues,
  navigateHowToUpload,
};

storiesOf("Graph", module).add("loading", () => (
  <StoryContainerComponent behaviors={[]}>
    <Graph {...props} loading />
  </StoryContainerComponent>
));

storiesOf("Graph", module).add("no data, three y-axis labels", () => (
  <StoryContainerComponent behaviors={[]}>
    <Graph {...props} />
  </StoryContainerComponent>
));

storiesOf("Graph", module).add("no data, four y-axis labels", () => (
  <StoryContainerComponent behaviors={[]}>
    <Graph
      {...props}
      yAxisLabelValues={makeYAxisLabelValues({ low: 90, high: 150 })}
      yAxisBGBoundaryValues={makeYAxisBGBoundaryValues({ low: 90, high: 150 })}
    />
  </StoryContainerComponent>
));

export { makeYAxisLabelValues };
