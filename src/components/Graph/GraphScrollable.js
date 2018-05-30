import React, { PureComponent } from "react";
import { Platform } from "react-native";
import PropTypes from "prop-types";
import glamorous, { withTheme } from "glamorous-native";

import { ThemePropType } from "../../prop-types/theme";
import GraphScrollableGl from "./gl/GraphScrollableGl";
import GraphScrollableSvg from "./svg/GraphScrollableSvg";
import {
  calculateRelativeCenterTimeSeconds,
  calculateScrollXAndRelativeCenterTimeSeconds,
  GRAPH_RENDERER_SVG,
  GRAPH_RENDERER_THREE_JS,
} from "./helpers";

class GraphScrollable extends PureComponent {
  constructor(props) {
    super(props);

    // Set initial relativeCenterTimeSeconds for contentOffset to be the event time. Do this before
    // initial render so we can use it to calculate contentOffset for initial scroll position.
    // Don't use state for this since we don't want a re-render when this changes.
    const {
      graphScalableLayoutInfo: { eventTimeSeconds, graphStartTimeSeconds },
    } = this.props;
    const relativeCenterTimeSeconds = eventTimeSeconds - graphStartTimeSeconds;
    this.relativeCenterTimeSeconds = relativeCenterTimeSeconds;
  }

  componentDidMount() {
    const { isZooming, graphScalableLayoutInfo } = this.props;
    const result = calculateScrollXAndRelativeCenterTimeSeconds({
      graphScalableLayoutInfo,
      relativeCenterTimeSeconds: this.relativeCenterTimeSeconds,
      isZooming,
    });
    if (this.graphScrollableRef && this.graphScrollableRef.onContentOffsetX) {
      this.graphScrollableRef.onContentOffsetX(result.x);
    }

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
      const { graphScalableLayoutInfo } = this.props;
      const { scaledContentWidth } = graphScalableLayoutInfo;
      const {
        scaledContentWidth: prevScaledContentWidth,
      } = prevProps.graphScalableLayoutInfo;

      // If the scale has changed, restore scroll position to the last stored relativeCenterTimeSeconds
      if (scaledContentWidth !== prevScaledContentWidth) {
        this.scrollToRelativeCenterTimeSeconds();
      }
    }
  }

  onScroll = event => {
    const { nativeEvent } = event;
    const { isZooming, graphScalableLayoutInfo } = this.props;
    if (!isZooming) {
      const {
        contentOffset: { x },
      } = nativeEvent;
      const relativeCenterTimeSeconds = calculateRelativeCenterTimeSeconds({
        graphScalableLayoutInfo,
        x,
      });
      this.relativeCenterTimeSeconds = relativeCenterTimeSeconds;
      if (this.graphScrollableRef && this.graphScrollableRef.onContentOffsetX) {
        this.graphScrollableRef.onContentOffsetX(x);
      }
    }
  };

  getPropsForGraphScrollable() {
    const {
      theme,
      isLoading,
      isZooming,
      graphScalableLayoutInfo,
      yAxisBGBoundaryValues,
      yAxisLabelValues,
      cbgData,
      smbgData,
      basalData,
      maxBasalValue,
    } = this.props;

    const props = {
      ref: graphScrollableRef => {
        this.graphScrollableRef = graphScrollableRef;
      },
      theme,
      isLoading,
      isZooming,
      graphScalableLayoutInfo,
      yAxisBGBoundaryValues,
      yAxisLabelValues,
      cbgData,
      smbgData,
      basalData,
      maxBasalValue,
    };

    return props;
  }

  scrollToRelativeCenterTimeSeconds() {
    const { graphScalableLayoutInfo, isZooming } = this.props;
    const { relativeCenterTimeSeconds } = this;
    const result = calculateScrollXAndRelativeCenterTimeSeconds({
      graphScalableLayoutInfo,
      relativeCenterTimeSeconds,
      isZooming,
    });
    this.relativeCenterTimeSeconds = result.relativeCenterTimeSeconds;
    if (this.graphScrollableRef && this.graphScrollableRef.onContentOffsetX) {
      this.graphScrollableRef.onContentOffsetX(result.x);
    }
    this.scrollView.scrollTo({
      x: result.x,
      y: 0,
      animated: false,
    });
  }

  renderGraphScrollableSvg() {
    return <GraphScrollableSvg {...this.getPropsForGraphScrollable()} />;
  }

  renderGraphScrollableGlPlaceholder() {
    const {
      graphScalableLayoutInfo: {
        scaledContentWidth,
        graphFixedLayoutInfo: { headerHeight },
      },
    } = this.props;

    return <glamorous.View height={headerHeight} width={scaledContentWidth} />;
  }

  renderGraphScrollableGl() {
    const {
      graphScalableLayoutInfo,
      graphScalableLayoutInfo: { graphFixedLayoutInfo },
    } = this.props;

    return (
      <glamorous.View
        position="absolute"
        pointerEvents="none"
        width={graphScalableLayoutInfo.scaledContentWidth}
        height={graphFixedLayoutInfo.height}
      >
        <GraphScrollableGl {...this.getPropsForGraphScrollable()} />
      </glamorous.View>
    );
  }

  render() {
    const {
      graphRenderer,
      isZooming,
      isLoading,
      graphScalableLayoutInfo,
      graphScalableLayoutInfo: {
        graphFixedLayoutInfo: { width, height },
      },
    } = this.props;

    const { relativeCenterTimeSeconds } = this;
    const result = calculateScrollXAndRelativeCenterTimeSeconds({
      graphScalableLayoutInfo,
      relativeCenterTimeSeconds,
      isZooming,
    });
    this.relativeCenterTimeSeconds = result.relativeCenterTimeSeconds;
    if (this.graphScrollableRef && this.graphScrollableRef.onContentOffsetX) {
      this.graphScrollableRef.onContentOffsetX(result.x);
    }
    const contentOffset = { x: result.x, y: 0 };

    // console.log(`GraphScrollable: render: contentOffsetX: ${contentOffset.x}`);

    return (
      <glamorous.View position="absolute" width={width} height={height}>
        <glamorous.ScrollView
          innerRef={scrollView => {
            this.scrollView = scrollView;
          }}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentOffset={contentOffset}
          onScroll={this.onScroll}
          scrollEventThrottle={16}
          scrollEnabled={!isLoading && !isZooming}
        >
          {graphRenderer === GRAPH_RENDERER_SVG
            ? this.renderGraphScrollableSvg()
            : this.renderGraphScrollableGlPlaceholder()}
        </glamorous.ScrollView>
        {graphRenderer === GRAPH_RENDERER_THREE_JS
          ? this.renderGraphScrollableGl()
          : null}
      </glamorous.View>
    );
  }
}

GraphScrollable.propTypes = {
  theme: ThemePropType.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isZooming: PropTypes.bool,
  graphRenderer: PropTypes.string.isRequired,
  graphScalableLayoutInfo: PropTypes.object.isRequired,
  yAxisBGBoundaryValues: PropTypes.arrayOf(PropTypes.number.isRequired)
    .isRequired,
  yAxisLabelValues: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired,
  cbgData: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  smbgData: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  basalData: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  maxBasalValue: PropTypes.number.isRequired,
};

GraphScrollable.defaultProps = {
  isZooming: false,
};

export default withTheme(GraphScrollable);
