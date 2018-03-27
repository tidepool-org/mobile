import React, { Component } from "react";
import { StyleSheet } from "react-native";
import PropTypes from "prop-types";
import glamorous from "glamorous-native";

import GraphFixedLayoutInfo from "./GraphFixedLayoutInfo";
import GraphScalableLayoutInfo from "./GraphScalableLayoutInfo";
import GraphYAxisLabels from "./GraphYAxisLabels";
import GraphYAxisBGBoundaryLines from "./GraphYAxisBGBoundaryLines";
import GraphNoData from "./GraphNoData";
import GraphScrollable from "./GraphScrollable";

class Graph extends Component {
  constructor(props) {
    super(props);

    const graphFixedLayoutInfo = new GraphFixedLayoutInfo({});
    const graphScalableLayoutInfo = new GraphScalableLayoutInfo({
      graphFixedLayoutInfo,
    });
    this.state = {
      graphFixedLayoutInfo,
      graphScalableLayoutInfo,
    };
  }

  onContainerViewLayout = event => {
    const { layout } = event.nativeEvent;
    const graphFixedLayoutInfo = new GraphFixedLayoutInfo({
      width: layout.width,
      height: layout.headerHeight,
    });
    const graphScalableLayoutInfo = new GraphScalableLayoutInfo({
      graphFixedLayoutInfo,
    });
    this.setState({ graphFixedLayoutInfo, graphScalableLayoutInfo });
  };

  renderLoading() {
    const { loading } = this.props;

    if (loading) {
      return (
        <glamorous.View
          style={{ ...StyleSheet.absoluteFillObject }}
          justifyContent="center"
          alignItems="center"
        >
          <glamorous.Image
            width={248}
            height={155}
            source={require("../../../assets/images/jump-jump-jump-jump.gif")}
          />
        </glamorous.View>
      );
    }

    return null;
  }

  renderNoData() {
    if (this.state.graphFixedLayoutInfo.width) {
      const { loading, navigateHowToUpload } = this.props;

      if (!loading) {
        return (
          <glamorous.View
            position="absolute"
            pointerEvents="box-none"
            top={this.state.graphFixedLayoutInfo.headerHeight}
            height={this.state.graphFixedLayoutInfo.graphLayerHeight}
            width={this.state.graphFixedLayoutInfo.width}
          >
            <GraphNoData
              graphFixedLayoutInfo={this.state.graphFixedLayoutInfo}
              navigateHowToUpload={navigateHowToUpload}
            />
          </glamorous.View>
        );
      }
    }

    return null;
  }

  renderFixedYAxisLabels() {
    if (this.state.graphFixedLayoutInfo.width) {
      const { yAxisLabelValues } = this.props;
      const { graphFixedLayoutInfo } = this.state;

      return (
        <glamorous.View
          position="absolute"
          pointerEvents="none"
          top={this.state.graphFixedLayoutInfo.headerHeight}
          width={25}
          height={this.state.graphFixedLayoutInfo.graphLayerHeight}
          backgroundColor="transparent"
        >
          <GraphYAxisLabels
            yAxisLabelValues={yAxisLabelValues}
            graphFixedLayoutInfo={graphFixedLayoutInfo}
          />
        </glamorous.View>
      );
    }

    return null;
  }

  renderFixedYAxisBGBoundaryLines() {
    if (this.state.graphFixedLayoutInfo.width) {
      const { yAxisBGBoundaryValues } = this.props;
      const { graphFixedLayoutInfo } = this.state;

      return (
        <glamorous.View
          position="absolute"
          pointerEvents="none"
          top={this.state.graphFixedLayoutInfo.headerHeight}
          height={this.state.graphFixedLayoutInfo.graphLayerHeight}
        >
          <GraphYAxisBGBoundaryLines
            yAxisBGBoundaryValues={yAxisBGBoundaryValues}
            graphFixedLayoutInfo={graphFixedLayoutInfo}
          />
        </glamorous.View>
      );
    }

    return null;
  }

  renderFixedBackground() {
    if (this.state.graphFixedLayoutInfo.width) {
      return (
        <glamorous.View
          position="absolute"
          pointerEvents="none"
          top={this.state.graphFixedLayoutInfo.headerHeight}
          width={this.state.graphFixedLayoutInfo.width}
          height={this.state.graphFixedLayoutInfo.graphLayerHeight}
          backgroundColor="#f6f6f6"
        />
      );
    }

    return null;
  }

  renderGraphScrollable() {
    if (this.state.graphScalableLayoutInfo.scaledContentWidth) {
      const { loading } = this.props;
      const { graphScalableLayoutInfo } = this.state;
      return (
        <GraphScrollable
          loading={loading}
          graphScalableLayoutInfo={graphScalableLayoutInfo}
        />
      );
    }

    return null;
  }

  render() {
    return (
      <glamorous.View height={180} onLayout={this.onContainerViewLayout}>
        {this.renderFixedBackground()}
        {this.renderFixedYAxisLabels()}
        {this.renderFixedYAxisBGBoundaryLines()}
        {this.renderGraphScrollable()}
        {this.renderNoData()}
        {this.renderLoading()}
      </glamorous.View>
    );
  }
}

Graph.propTypes = {
  loading: PropTypes.bool.isRequired,
  yAxisLabelValues: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired,
  yAxisBGBoundaryValues: PropTypes.arrayOf(PropTypes.number.isRequired)
    .isRequired,
  navigateHowToUpload: PropTypes.func.isRequired,
};

export default Graph;
