import React, { PureComponent } from "react";
import { Platform } from "react-native";
import PropTypes from "prop-types";
import { Svg } from "expo";
import glamorous, { withTheme } from "glamorous-native";

import { ThemePropType } from "../../prop-types/theme";
import { GraphNoteEvent } from "./GraphNoteEvent";
import { GraphXAxisHeader } from "./GraphXAxisHeader";
import { GraphCbg } from "./GraphCbg";
import { GraphSmbg } from "./GraphSmbg";

class GraphScrollable extends PureComponent {
  constructor(props) {
    super(props);

    // Set initial relativeCenterTimeSeconds for contentOffset to be the event time. Do this before initial render so we can use it to calculate contentOffset for initial scroll position
    const {
      graphScalableLayoutInfo: { eventTimeSeconds, graphStartTimeSeconds },
    } = props;
    this.relativeCenterTimeSeconds = eventTimeSeconds - graphStartTimeSeconds;
  }

  componentDidMount() {
    // Android doesn't support contentOffset, so, scroll to the initial center time here. The timeout is also needed for Android, else the initial scroll doesn't take effect
    if (Platform.OS === "android") {
      setTimeout(() => {
        this.scrollToRelativeCenterTimeSeconds();
      }, 0);
    }
  }

  componentDidUpdate(prevProps) {
    // Android doesn't support contentOffset, so, we also need to scroll to the last stored center time after the component renders
    if (Platform.OS === "android") {
      const { scaledContentWidth } = this.props.graphScalableLayoutInfo;
      const {
        scaledContentWidth: prevScaledContentWidth,
      } = prevProps.graphScalableLayoutInfo;

      // If the scale has changed, restore scroll position to the last stored relativeCenterTimeSeconds
      if (scaledContentWidth !== prevScaledContentWidth) {
        this.scrollToRelativeCenterTimeSeconds();
      }
    }
  }

  onScroll = ({ nativeEvent }) => {
    const { isZooming } = this.props;
    // Since we can also get scroll events during zoom, only store an updated center time if the user is not zooming
    if (!isZooming) {
      const { contentOffset: { x } } = nativeEvent;
      this.relativeCenterTimeSeconds = this.calculateRelativeCenterTimeSecondsForScrollX(
        x
      );
    }
  };

  scrollToRelativeCenterTimeSeconds() {
    const x = this.calculateScrollXForRelativeCenterTimeSeconds(
      this.relativeCenterTimeSeconds
    );
    this.scrollView.scrollTo({
      x,
      y: 0,
      animated: false,
    });
  }

  calculateRelativeCenterTimeSecondsForScrollX(x) {
    const { graphScalableLayoutInfo } = this.props;
    const { secondsPerPixel, secondsInView } = graphScalableLayoutInfo;
    const scrollSeconds = x * secondsPerPixel;
    const relativeCenterTimeSeconds = scrollSeconds + secondsInView / 2;
    return relativeCenterTimeSeconds;
  }

  // relativeCenterTimeSeconds is relative to graphStartTimeSeconds (so, 0 is start of graph)
  calculateScrollXForRelativeCenterTimeSeconds(relativeCenterTimeSeconds) {
    const {
      scaledContentWidth,
      pixelsPerSecond,
      secondsInView,
      graphFixedLayoutInfo,
    } = this.props.graphScalableLayoutInfo;
    const viewStartTimeSeconds = Math.max(
      0,
      relativeCenterTimeSeconds - secondsInView / 2
    );
    const secondsToScroll = viewStartTimeSeconds;
    const scrollableContentWidth =
      scaledContentWidth - graphFixedLayoutInfo.width;
    const x = Math.min(
      scrollableContentWidth,
      Math.round(pixelsPerSecond * secondsToScroll)
    );

    return x;
  }

  render() {
    // console.log("GraphScrollable: render");

    const {
      theme,
      isZooming,
      isLoading,
      graphScalableLayoutInfo,
      graphScalableLayoutInfo: {
        eventTimeSeconds,
        graphStartTimeSeconds,
        pixelsPerSecond,
      },
      graphScalableLayoutInfo: {
        graphFixedLayoutInfo: {
          height,
          yAxisHeightInPixels,
          yAxisPixelsPerValue,
          headerHeight,
        },
      },
      cbgData,
      smbgData,
    } = this.props;
    const x = this.calculateScrollXForRelativeCenterTimeSeconds(
      this.relativeCenterTimeSeconds
    );
    const contentOffset = { x, y: 0 };

    // FIXME: For now, on most Android devices, the Graph doesn't render interactively enough
    // during zoom to support live scale change. We should revisit this as we test on more devices
    // (both iOS and Android) and after we do a rendering performance optimization pass. (See
    // related "graph - perf" TODOs.)
    let shouldRenderGraphData = !isLoading;
    if (Platform.OS === "android") {
      shouldRenderGraphData = !isLoading && !isZooming;
    }

    const {
      ticks: xAxisTicksSvgElements,
      labels: xAxisLabelsViews,
    } = GraphXAxisHeader.renderTicksAndLabels({
      theme,
      graphScalableLayoutInfo,
    });

    const noteSvgElements = GraphNoteEvent.renderNoteEventSvgElements({
      eventTimeSeconds,
      graphStartTimeSeconds,
      pixelsPerSecond,
      height,
    });

    const cbgSvgElements = shouldRenderGraphData
      ? GraphCbg.renderSamplesSvgElements({
          theme,
          cbgData,
          yAxisHeightInPixels,
          yAxisPixelsPerValue,
          headerHeight,
          graphStartTimeSeconds,
          pixelsPerSecond,
        })
      : null;

    const smbgSvgElements = shouldRenderGraphData
      ? GraphSmbg.renderSamplesSvgElements({
          theme,
          smbgData,
          yAxisHeightInPixels,
          yAxisPixelsPerValue,
          headerHeight,
          graphStartTimeSeconds,
          pixelsPerSecond,
        })
      : null;

    return (
      <glamorous.ScrollView
        innerRef={scrollView => {
          this.scrollView = scrollView;
        }}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentOffset={contentOffset}
        onScroll={this.onScroll}
        scrollEventThrottle={16}
      >
        <glamorous.View
          height={
            this.props.graphScalableLayoutInfo.graphFixedLayoutInfo.headerHeight
          }
          width={this.props.graphScalableLayoutInfo.scaledContentWidth}
          backgroundColor="white"
        >
          {xAxisLabelsViews}
        </glamorous.View>
        <glamorous.View
          position="absolute"
          pointerEvents="none"
          height={height}
          width={this.props.graphScalableLayoutInfo.scaledContentWidth}
        >
          <Svg
            height={height}
            width={this.props.graphScalableLayoutInfo.scaledContentWidth}
          >
            {xAxisTicksSvgElements}
            {noteSvgElements}
            {cbgSvgElements}
            {smbgSvgElements}
          </Svg>
        </glamorous.View>
      </glamorous.ScrollView>
    );
  }
}

GraphScrollable.propTypes = {
  theme: ThemePropType.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isZooming: PropTypes.bool,
  graphScalableLayoutInfo: PropTypes.object.isRequired,
  cbgData: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  smbgData: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
};

GraphScrollable.defaultProps = {
  isZooming: false,
};

export default withTheme(GraphScrollable);
