import React, { PureComponent } from "react";
import { StyleSheet } from "react-native";
import PropTypes from "prop-types";
import glamorous, { withTheme } from "glamorous-native";

import { ThemePropType } from "../../prop-types/theme";
import GraphFixedLayoutInfo from "./GraphFixedLayoutInfo";
import GraphScalableLayoutInfo from "./GraphScalableLayoutInfo";
import GraphYAxisLabels from "./GraphYAxisLabels";
import GraphYAxisBGBoundaryLinesSvg from "./svg/GraphYAxisBGBoundaryLinesSvg";
import GraphNoData from "./GraphNoData";
import GraphScrollable from "./GraphScrollable";
import GraphZoomable from "./GraphZoomable";

class Graph extends PureComponent {
  static renderLoadingIndicator() {
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

  static renderNoData({ navigateHowToUpload, graphFixedLayoutInfo }) {
    return (
      <glamorous.View
        position="absolute"
        pointerEvents="box-none"
        top={graphFixedLayoutInfo.headerHeight}
        height={graphFixedLayoutInfo.graphLayerHeight}
        width={graphFixedLayoutInfo.width}
      >
        <GraphNoData
          graphFixedLayoutInfo={graphFixedLayoutInfo}
          navigateHowToUpload={navigateHowToUpload}
        />
      </glamorous.View>
    );
  }

  constructor(props) {
    super(props);

    const { scale, eventTime } = props;
    const graphFixedLayoutInfo = new GraphFixedLayoutInfo({});
    const graphScalableLayoutInfo = new GraphScalableLayoutInfo({
      graphFixedLayoutInfo,
      scale,
      eventTime,
    });
    this.state = {
      graphFixedLayoutInfo,
      graphScalableLayoutInfo,
    };
    this.scale = scale;
  }

  onContainerViewLayout = event => {
    const { scale } = this;
    const { eventTime } = this.props;
    const { layout } = event.nativeEvent;
    const graphFixedLayoutInfo = new GraphFixedLayoutInfo({
      width: layout.width,
      height: layout.headerHeight,
    });
    const graphScalableLayoutInfo = new GraphScalableLayoutInfo({
      graphFixedLayoutInfo,
      scale,
      eventTime,
    });
    this.setState({ graphFixedLayoutInfo, graphScalableLayoutInfo });
  };

  onZoomStart = () => {
    // console.log("onZoomStart");
    this.setState({
      isZooming: true,
    });

    if (this.props.onZoomStart) {
      this.props.onZoomStart();
    }
  };

  onZoomMove = scale => {
    // console.log("onZoomMove");
    const { eventTime } = this.props;
    const graphScalableLayoutInfo = new GraphScalableLayoutInfo({
      graphFixedLayoutInfo: this.state.graphFixedLayoutInfo,
      scale: this.scale * scale,
      eventTime,
    });
    this.setState({ graphScalableLayoutInfo });
  };

  onZoomCommit = () => {
    // console.log("onZoomCommit");
    this.scale = this.state.graphScalableLayoutInfo.scale; // Use last graphScalableLayoutInfo, not the scale passed to onZoomCommi (graphScalableLayoutInfo scale is constrained)
  };

  onZoomEnd = () => {
    // console.log("onZoomEnd");
    this.setState({
      isZooming: false,
    });

    if (this.props.onZoomEnd) {
      this.props.onZoomEnd();
    }
  };

  renderFixedBackground() {
    // console.log(`renderFixedBackground`);

    const { theme, yAxisLabelValues, yAxisBGBoundaryValues } = this.props;
    const { graphFixedLayoutInfo } = this.state;

    return (
      <glamorous.View
        position="absolute"
        pointerEvents="none"
        top={this.state.graphFixedLayoutInfo.headerHeight}
        width={this.state.graphFixedLayoutInfo.width}
        height={this.state.graphFixedLayoutInfo.graphLayerHeight}
        backgroundColor={theme.graphBackgroundColor}
      >
        <GraphYAxisLabels
          yAxisLabelValues={yAxisLabelValues}
          graphFixedLayoutInfo={graphFixedLayoutInfo}
        />
        <GraphYAxisBGBoundaryLinesSvg
          yAxisBGBoundaryValues={yAxisBGBoundaryValues}
          graphFixedLayoutInfo={graphFixedLayoutInfo}
        />
      </glamorous.View>
    );
  }

  renderGraphZoomable() {
    const { isLoading, cbgData, smbgData, navigateHowToUpload } = this.props;
    const { graphScalableLayoutInfo, graphFixedLayoutInfo } = this.state;
    const shouldRenderLoadingIndicator = isLoading;
    const shouldRenderNoData =
      !isLoading && cbgData.length === 0 && smbgData.length === 0;

    if (graphScalableLayoutInfo.scaledContentWidth) {
      return (
        <GraphZoomable
          graphFixedLayoutInfo={graphFixedLayoutInfo}
          onZoomStart={this.onZoomStart}
          onZoomMove={this.onZoomMove}
          onZoomCommit={this.onZoomCommit}
          onZoomEnd={this.onZoomEnd}
          isZoomingEnabled={!isLoading}
        >
          {this.renderFixedBackground()}
          {this.renderGraphScrollable()}
          {shouldRenderNoData
            ? Graph.renderNoData({ navigateHowToUpload, graphFixedLayoutInfo })
            : null}
          {shouldRenderLoadingIndicator ? Graph.renderLoadingIndicator() : null}
        </GraphZoomable>
      );
    }

    return null;
  }

  renderGraphScrollable() {
    const { isLoading, cbgData, smbgData, graphRenderer } = this.props;
    const { graphScalableLayoutInfo, isZooming } = this.state;

    return (
      <GraphScrollable
        isLoading={isLoading}
        isZooming={isZooming}
        graphScalableLayoutInfo={graphScalableLayoutInfo}
        cbgData={cbgData}
        smbgData={smbgData}
        graphRenderer={graphRenderer}
      />
    );
  }

  render() {
    // console.log("Graph: render");

    return (
      <glamorous.View height={180} onLayout={this.onContainerViewLayout}>
        {this.renderGraphZoomable()}
      </glamorous.View>
    );
  }
}

Graph.propTypes = {
  theme: ThemePropType.isRequired,
  isLoading: PropTypes.bool.isRequired,
  yAxisLabelValues: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired,
  yAxisBGBoundaryValues: PropTypes.arrayOf(PropTypes.number.isRequired)
    .isRequired,
  cbgData: PropTypes.arrayOf(PropTypes.object.isRequired),
  smbgData: PropTypes.arrayOf(PropTypes.object.isRequired),
  scale: PropTypes.number,
  eventTime: PropTypes.instanceOf(Date),
  navigateHowToUpload: PropTypes.func.isRequired,
  graphRenderer: PropTypes.string.isRequired,
  onZoomStart: PropTypes.func,
  onZoomEnd: PropTypes.func,
};

Graph.defaultProps = {
  scale: 2.5,
  eventTime: new Date(),
  cbgData: [],
  smbgData: [],
  onZoomStart: null,
  onZoomEnd: null,
};

export default withTheme(Graph);
