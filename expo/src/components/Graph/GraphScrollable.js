import React, { Component } from "react";
import { Platform } from "react-native";
import PropTypes from "prop-types";
import glamorous from "glamorous-native";

import GraphNoteEvent from "./GraphNoteEvent";
import GraphXAxisHeader from "./GraphXAxisHeader";

// TODO: graph - handle pinch to zoom

class GraphScrollable extends Component {
  componentDidMount() {
    const {
      scaledContentWidth,
      graphFixedLayoutInfo,
    } = this.props.graphScalableLayoutInfo;
    const scrollableContentWidth =
      scaledContentWidth - graphFixedLayoutInfo.width;
    const scrollToX = scrollableContentWidth / 2;

    // This setTimeout is needed for Android, without this, Android won't scroll.
    const scrollToMiddle = () => {
      this.scrollView.scrollTo({
        x: scrollToX,
        y: 0,
        animated: false,
      });
    };
    if (Platform.OS === "android") {
      setTimeout(scrollToMiddle, 0);
    } else {
      scrollToMiddle();
    }
  }

  renderPlaceholder() {
    // This dummy view is needed to ensure the content size of the view, given absolute positioning of other elements
    return (
      <glamorous.View
        height={this.props.graphScalableLayoutInfo.graphFixedLayoutInfo.height}
        width={this.props.graphScalableLayoutInfo.scaledContentWidth}
      />
    );
  }

  renderHeader() {
    return (
      <glamorous.View
        position="absolute"
        pointerEvents="none"
        height={
          this.props.graphScalableLayoutInfo.graphFixedLayoutInfo.headerHeight
        }
        width={this.props.graphScalableLayoutInfo.scaledContentWidth}
      >
        <GraphXAxisHeader
          graphScalableLayoutInfo={this.props.graphScalableLayoutInfo}
        />
      </glamorous.View>
    );
  }

  renderNoteEvent() {
    return (
      <glamorous.View
        position="absolute"
        pointerEvents="none"
        height={this.props.graphScalableLayoutInfo.graphFixedLayoutInfo.height}
        width={this.props.graphScalableLayoutInfo.scaledContentWidth}
      >
        <GraphNoteEvent
          graphScalableLayoutInfo={this.props.graphScalableLayoutInfo}
        />
      </glamorous.View>
    );
  }

  renderGraph() {
    const { loading } = this.props;

    if (!loading) {
      return (
        <glamorous.View
          position="absolute"
          pointerEvents="none"
          backgroundColor="transparent"
          top={
            this.props.graphScalableLayoutInfo.graphFixedLayoutInfo.headerHeight
          }
          height={
            this.props.graphScalableLayoutInfo.graphFixedLayoutInfo
              .graphLayerHeight
          }
          width={this.props.graphScalableLayoutInfo.scaledContentWidth}
        />
      );
    }

    return null;
  }

  render() {
    return (
      <glamorous.ScrollView
        innerRef={scrollView => {
          this.scrollView = scrollView;
        }}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {this.renderPlaceholder()}
        {this.renderHeader()}
        {this.renderNoteEvent()}
        {this.renderGraph()}
      </glamorous.ScrollView>
    );
  }
}

GraphScrollable.propTypes = {
  loading: PropTypes.bool.isRequired,
  graphScalableLayoutInfo: PropTypes.object.isRequired,
};

export default GraphScrollable;
