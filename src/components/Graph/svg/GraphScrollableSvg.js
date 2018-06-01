import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import glamorous from "glamorous-native";
import { Svg } from "expo";

import { ThemePropType } from "../../../prop-types/theme";
import GraphNoteEventSvg from "./GraphNoteEventSvg";
import GraphXAxisHeaderSvg from "./GraphXAxisHeaderSvg";
import GraphCbgSvg from "./GraphCbgSvg";
import GraphSmbgSvg from "./GraphSmbgSvg";

class GraphScrollableSvg extends PureComponent {
  render() {
    const {
      isLoading,
      theme,
      graphScalableLayoutInfo,
      graphScalableLayoutInfo: {
        eventTimeSeconds,
        graphStartTimeSeconds,
        graphEndTimeSeconds,
        pixelsPerSecond,
        scaledContentWidth,
      },
      graphScalableLayoutInfo: {
        graphFixedLayoutInfo: {
          height,
          headerHeight,
          yAxisGlucosePixelsPerValue,
          yAxisBottomOfGlucose,
        },
      },
      cbgData,
      smbgData,
    } = this.props;

    // console.log(`GraphScrollableSvg: render`);

    const shouldRenderGraphData = !isLoading;
    const { ticks, labels } = GraphXAxisHeaderSvg.renderTicksAndLabels({
      theme,
      graphScalableLayoutInfo,
    });
    const xAxisTicksSvgElements = ticks;
    const xAxisLabelsViews = labels;

    const noteSvgElements = GraphNoteEventSvg.render({
      eventTimeSeconds,
      graphStartTimeSeconds,
      graphEndTimeSeconds,
      pixelsPerSecond,
      height,
    });

    let cbgSvgElements = null;
    cbgSvgElements = shouldRenderGraphData
      ? GraphCbgSvg.render({
          theme,
          cbgData,
          yAxisGlucosePixelsPerValue,
          yAxisBottomOfGlucose,
          graphStartTimeSeconds,
          graphEndTimeSeconds,
          pixelsPerSecond,
        })
      : null;

    const smbgSvgElements = shouldRenderGraphData
      ? GraphSmbgSvg.render({
          theme,
          smbgData,
          yAxisGlucosePixelsPerValue,
          yAxisBottomOfGlucose,
          graphStartTimeSeconds,
          graphEndTimeSeconds,
          pixelsPerSecond,
        })
      : null;

    return (
      <glamorous.View>
        <glamorous.View
          height={headerHeight}
          width={scaledContentWidth}
          backgroundColor="white"
        >
          {xAxisLabelsViews}
        </glamorous.View>
        <glamorous.View
          position="absolute"
          pointerEvents="none"
          height={height}
          width={scaledContentWidth}
        >
          <Svg height={height} width={scaledContentWidth}>
            {xAxisTicksSvgElements}
            {noteSvgElements}
            {cbgSvgElements}
            {smbgSvgElements}
          </Svg>
        </glamorous.View>
      </glamorous.View>
    );
  }
}

GraphScrollableSvg.propTypes = {
  theme: ThemePropType.isRequired,
  isLoading: PropTypes.bool.isRequired,
  graphScalableLayoutInfo: PropTypes.object.isRequired,
  cbgData: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  smbgData: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
};

export default GraphScrollableSvg;
