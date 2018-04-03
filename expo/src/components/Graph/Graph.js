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
import GraphZoom from "./GraphZoom";

class Graph extends Component {
  constructor(props) {
    super(props);

    const { scale } = props;
    const graphFixedLayoutInfo = new GraphFixedLayoutInfo({});
    const graphScalableLayoutInfo = new GraphScalableLayoutInfo({
      graphFixedLayoutInfo,
      scale,
    });
    this.state = {
      graphFixedLayoutInfo,
      graphScalableLayoutInfo,
      scale,
    };
  }

  onContainerViewLayout = event => {
    const { scale } = this.state;
    const { layout } = event.nativeEvent;
    const graphFixedLayoutInfo = new GraphFixedLayoutInfo({
      width: layout.width,
      height: layout.headerHeight,
    });
    const graphScalableLayoutInfo = new GraphScalableLayoutInfo({
      graphFixedLayoutInfo,
      scale,
    });
    this.setState({ graphFixedLayoutInfo, graphScalableLayoutInfo });
  };

  onZoomMove = scale => {
    const graphScalableLayoutInfo = new GraphScalableLayoutInfo({
      graphFixedLayoutInfo: this.state.graphFixedLayoutInfo,
      scale: this.state.scale * scale,
    });
    this.setState({
      graphScalableLayoutInfo,
      isZooming: true,
    });
  };

  onZoomEnd = scale => {
    const graphScalableLayoutInfo = new GraphScalableLayoutInfo({
      graphFixedLayoutInfo: this.state.graphFixedLayoutInfo,
      scale: this.state.scale * scale,
    });
    this.setState({
      graphScalableLayoutInfo,
      scale: graphScalableLayoutInfo.scale, // Use the constrained scale from the new GraphScalableLayoutInfo
      isZooming: false,
    });
  };

  renderLoading() {
    const { loading } = this.props;

    if (loading) {
      return (
        <glamorous.View
          style={{ ...StyleSheet.absoluteFillObject }}
          justifyContent="center"
          alignItems="center"
          pointerEvents="none"
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

    return null;
  }

  renderFixedYAxisLabels() {
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

  renderFixedYAxisBGBoundaryLines() {
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

  renderFixedBackground() {
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

  renderGraphZoom() {
    const { graphScalableLayoutInfo, graphFixedLayoutInfo } = this.state;
    if (graphScalableLayoutInfo.scaledContentWidth) {
      return (
        <GraphZoom
          graphFixedLayoutInfo={graphFixedLayoutInfo}
          onZoomMove={this.onZoomMove}
          onZoomEnd={this.onZoomEnd}
        >
          {this.renderFixedBackground()}
          {this.renderFixedYAxisLabels()}
          {this.renderFixedYAxisBGBoundaryLines()}
          {this.renderGraphScrollable()}
          {this.renderNoData()}
          {this.renderLoading()}
        </GraphZoom>
      );
    }

    return null;
  }

  renderGraphScrollable() {
    const { loading } = this.props;
    const { graphScalableLayoutInfo, isZooming } = this.state;
    return (
      <GraphScrollable
        loading={loading}
        graphScalableLayoutInfo={graphScalableLayoutInfo}
        isZooming={isZooming}
      />
    );
  }

  render() {
    return (
      <glamorous.View height={180} onLayout={this.onContainerViewLayout}>
        {this.renderGraphZoom()}
      </glamorous.View>
    );
  }
}

Graph.propTypes = {
  loading: PropTypes.bool.isRequired,
  yAxisLabelValues: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired,
  yAxisBGBoundaryValues: PropTypes.arrayOf(PropTypes.number.isRequired)
    .isRequired,
  scale: PropTypes.number,
  navigateHowToUpload: PropTypes.func.isRequired,
};

Graph.defaultProps = {
  scale: 2.5,
};

export default Graph;
