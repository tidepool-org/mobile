import React, { PureComponent } from "react";
import { PixelRatio } from "react-native";
import PropTypes from "prop-types";
import ExpoTHREE, { THREE } from "expo-three";

import { ThemePropType } from "../../../prop-types/theme";
import GraphGlView from "./GraphGlView";
import GraphYAxisGl from "./GraphYAxisGl";
import GraphXAxisGl from "./GraphXAxisGl";
import GraphNoteEventGl from "./GraphNoteEventGl";
import GraphCbgGl from "./GraphCbgGl";
import GraphSmbgGl from "./GraphSmbgGl";
import GraphBasalGl from "./GraphBasalGl";
import { convertHexColorStringToInt } from "../helpers";

const { createRenderer } = ExpoTHREE;

class GraphScrollableGl extends PureComponent {
  componentDidMount() {
    const {
      theme,
      graphScalableLayoutInfo: { graphStartTimeSeconds, graphFixedLayoutInfo },
    } = this.props;

    const graphLayerCommonProps = {
      theme,
      graphFixedLayoutInfo,
      graphStartTimeSeconds,
    };
    const graphYAxisGl = new GraphYAxisGl({
      ...graphLayerCommonProps,
      zStart: 100,
      zEnd: 199,
    });
    const graphXAxisGl = new GraphXAxisGl({
      ...graphLayerCommonProps,
      zStart: 200,
      zEnd: 299,
    });
    const graphCbgGl = new GraphCbgGl({
      ...graphLayerCommonProps,
      zStart: 300,
      zEnd: 399,
    });
    const graphSmbgGl = new GraphSmbgGl({
      ...graphLayerCommonProps,
      zStart: 400,
      zEnd: 499,
    });
    const graphBasalGl = new GraphBasalGl({
      ...graphLayerCommonProps,
      zStart: 300,
      zEnd: 399,
    });
    const graphNoteEventGl = new GraphNoteEventGl({
      ...graphLayerCommonProps,
      zStart: 500,
      zEnd: 599,
    });
    this.graphRenderLayers = [
      graphYAxisGl,
      graphXAxisGl,
      graphCbgGl,
      graphSmbgGl,
      graphBasalGl,
      graphNoteEventGl,
    ];

    this.contentOffsetX = 0;
  }

  onContentOffsetX(contentOffsetX) {
    const { isZooming } = this.props;
    const isScrolling = !isZooming;
    this.contentOffsetX = contentOffsetX;
    if (isScrolling) {
      this.renderScene();
    }
  }

  onContextCreate = async gl => {
    const {
      theme,
      graphScalableLayoutInfo: {
        graphFixedLayoutInfo: { height },
      },
    } = this.props;

    // Save the gl context
    this.gl = gl;

    // Create renderer
    this.renderer = createRenderer({ gl });
    this.renderer.sortObjects = false;
    this.renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
    this.renderer.setClearColor(
      convertHexColorStringToInt(theme.graphBackgroundColor),
      1
    );

    // Create camera
    const { drawingBufferWidth, drawingBufferHeight } = gl;
    this.camera = new THREE.OrthographicCamera(
      drawingBufferWidth / -2,
      drawingBufferWidth / 2,
      drawingBufferHeight / 2,
      drawingBufferHeight / -2,
      0,
      1000
    );
    const pixelRatio = PixelRatio.get();
    this.camera.position.x = drawingBufferWidth / 2;
    this.camera.position.y = -(height / 2) * pixelRatio;
    this.camera.position.z = 1000;

    // Create scene
    this.scene = new THREE.Scene();

    // // Create camera helper
    // const cameraHelper = new THREE.CameraHelper(this.camera);
    // this.scene.add(cameraHelper);

    // Do initial render of the scene
    // console.log(
    //   `GraphScrollableGl: onContextCreate: about to do initial render: width: ${drawingBufferWidth /
    //     pixelRatio}`
    // );

    this.renderScene();
  };

  renderScene() {
    if (this.scene) {
      // console.log("GraphScrollableGl: renderScene");

      this.graphRenderLayers.forEach(graphRenderLayer => {
        graphRenderLayer.render({
          ...this.props,
          scene: this.scene,
          contentOffsetX: this.contentOffsetX,
        });
      });
      this.renderer.render(this.scene, this.camera);
      this.gl.endFrameEXP();
    } else {
      // console.log("GraphScrollableGl: renderScene: No scene, skipped render");
    }
  }

  render() {
    // console.log("GraphScrollableGl: render");

    const {
      graphScalableLayoutInfo: {
        graphFixedLayoutInfo: { width, height },
      },
    } = this.props;

    if (this.scene) {
      this.renderScene();
    }

    return (
      <GraphGlView
        width={width}
        height={height}
        onContextCreate={this.onContextCreate}
      />
    );
  }
}

GraphScrollableGl.propTypes = {
  theme: ThemePropType.isRequired,
  isZooming: PropTypes.bool,
  graphScalableLayoutInfo: PropTypes.object.isRequired,
};

GraphScrollableGl.defaultProps = {
  isZooming: false,
};

export default GraphScrollableGl;
