import React, { PureComponent } from "react";
import { StyleSheet } from "react-native";
import PropTypes from "prop-types";
import glamorous, { withTheme } from "glamorous-native";

import { ThemePropType } from "../../prop-types/theme";
import { GRAPH_RENDERER_SVG } from "./helpers";
import GraphFixedLayoutInfo from "./GraphFixedLayoutInfo";
import GraphScalableLayoutInfo from "./GraphScalableLayoutInfo";
import GraphYAxisLabels from "./GraphYAxisLabels";
import GraphYAxisBGBoundaryLinesSvg from "./svg/GraphYAxisBGBoundaryLinesSvg";
import GraphNoData from "./GraphNoData";
import GraphScrollable from "./GraphScrollable";
import GraphZoomable from "./GraphZoomable";

class Graph extends PureComponent {
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
    const { onZoomStart } = this.props;
    this.setState({
      isZooming: true,
    });
    if (onZoomStart) {
      onZoomStart();
    }
  };

  onZoomMove = scale => {
    // console.log("onZoomMove");
    this.setState((prevState, props) => {
      const { eventTime } = props;
      const graphScalableLayoutInfo = new GraphScalableLayoutInfo({
        graphFixedLayoutInfo: prevState.graphFixedLayoutInfo,
        scale: this.scale * scale,
        eventTime,
      });
      return {
        graphScalableLayoutInfo,
      };
    });
  };

  onZoomCommit = () => {
    // console.log("onZoomCommit");
    const { graphScalableLayoutInfo } = this.state;
    this.scale = graphScalableLayoutInfo.scale; // Use last graphScalableLayoutInfo, not the scale passed to onZoomCommi (graphScalableLayoutInfo scale is constrained)
  };

  onZoomEnd = () => {
    // console.log("onZoomEnd");
    const { onZoomEnd } = this.props;
    this.setState({
      isZooming: false,
    });
    if (onZoomEnd) {
      onZoomEnd();
    }
  };

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

  renderFixedBackgroundSvg() {
    // console.log(`renderFixedBackgroundSvg`);

    const { theme, yAxisLabelValues, yAxisBGBoundaryValues } = this.props;
    const { graphFixedLayoutInfo } = this.state;

    return (
      <glamorous.View
        position="absolute"
        pointerEvents="none"
        top={graphFixedLayoutInfo.headerHeight}
        width={graphFixedLayoutInfo.width}
        height={graphFixedLayoutInfo.graphLayerHeight}
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
    const {
      isLoading,
      cbgData,
      smbgData,
      navigateHowToUpload,
      graphRenderer,
    } = this.props;
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
          {graphRenderer === GRAPH_RENDERER_SVG
            ? this.renderFixedBackgroundSvg()
            : null}
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
    const {
      isLoading,
      graphRenderer,
      yAxisBGBoundaryValues,
      yAxisLabelValues,
      cbgData,
      smbgData,
      basalData,
      maxBasalValue,
    } = this.props;
    const { graphScalableLayoutInfo, isZooming } = this.state;

    return (
      <GraphScrollable
        isLoading={isLoading}
        isZooming={isZooming}
        graphScalableLayoutInfo={graphScalableLayoutInfo}
        graphRenderer={graphRenderer}
        yAxisBGBoundaryValues={yAxisBGBoundaryValues}
        yAxisLabelValues={yAxisLabelValues}
        cbgData={cbgData}
        smbgData={smbgData}
        basalData={basalData}
        maxBasalValue={maxBasalValue}
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
  basalData: PropTypes.arrayOf(PropTypes.object.isRequired),
  maxBasalValue: PropTypes.number,
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
  basalData: [],
  maxBasalValue: 1.0,
  onZoomStart: null,
  onZoomEnd: null,
};

export default withTheme(Graph);
