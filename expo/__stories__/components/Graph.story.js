/* eslint import/no-extraneous-dependencies: 0 */
import React from "react";
import { storiesOf } from "@storybook/react-native";
import StoryContainerComponent from "../../__stories__/utils/StoryContainerComponent";
import Graph from "../../src/components/Graph/Graph";
import {
  makeYAxisLabelValues,
  makeYAxisBGBoundaryValues,
} from "../../src/components/Graph/helpers";

storiesOf("Graph", module).add("loading", () => (
  <StoryContainerComponent behaviors={[]}>
    <Graph
      loading
      yAxisLabelValues={makeYAxisLabelValues({})}
      yAxisBGBoundaryValues={makeYAxisBGBoundaryValues({})}
    />
  </StoryContainerComponent>
));

storiesOf("Graph", module).add("no data, three y-axis labels", () => (
  <StoryContainerComponent behaviors={[]}>
    <Graph
      loading={false}
      yAxisLabelValues={makeYAxisLabelValues({})}
      yAxisBGBoundaryValues={makeYAxisBGBoundaryValues({})}
    />
  </StoryContainerComponent>
));

storiesOf("Graph", module).add("no data, four y-axis labels", () => (
  <StoryContainerComponent behaviors={[]}>
    <Graph
      loading={false}
      yAxisLabelValues={makeYAxisLabelValues({ low: 90, high: 150 })}
      yAxisBGBoundaryValues={makeYAxisBGBoundaryValues({ low: 90, high: 150 })}
    />
  </StoryContainerComponent>
));

export { makeYAxisLabelValues };
