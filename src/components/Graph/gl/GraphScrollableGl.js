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
import GraphBolusGl from "./GraphBolusGl";
import GraphWizardGl from "./GraphWizardGl";
import { convertHexColorStringToInt } from "../helpers";
// import { Logger } from "../../../models/Logger";

class GraphScrollableGl extends PureComponent {
  componentDidMount() {
    this.contentOffsetX = 0;
    this.createScene();
  }

  // TODO: Revisit this after we upgrade eslint-config-airbnb
  /* eslint-disable react/sort-comp */
  UNSAFE_componentWillUpdate(nextProps) {
    // Determine whether this update is for a subsequent render with new data. If
    // so, re-create the scene. This handles the scenario where an initial
    // render, with data, occurred, and we're now refreshing the graph with new
    // data
    const { cbgData, smbgData, basalData, bolusData, wizardData } = this.props;

    const shouldCreateScene =
      cbgData.length !== nextProps.cbgData.length ||
      smbgData.length !== nextProps.smbgData.length ||
      basalData.length !== nextProps.basalData.length ||
      bolusData.length !== nextProps.bolusData.length ||
      wizardData.length !== nextProps.wizardData.length;

    if (shouldCreateScene) {
      this.createScene();
    }
  }
  /* eslint-enable react/sort-comp */

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
    this.renderer = new ExpoTHREE.Renderer({ gl });
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

    // Do initial render of the scene
    // console.log(
    //   `GraphScrollableGl: onContextCreate: about to do initial render: width: ${drawingBufferWidth /
    //     pixelRatio}`
    // );
    this.renderScene();
  };

  createScene() {
    this.scene = new THREE.Scene();

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
    const graphBasalGl = new GraphBasalGl({
      ...graphLayerCommonProps,
      zStart: 300,
      zEnd: 399,
    });
    const graphCbgGl = new GraphCbgGl({
      ...graphLayerCommonProps,
      zStart: 300,
      zEnd: 399,
    });
    const graphNoteEventGl = new GraphNoteEventGl({
      ...graphLayerCommonProps,
      zStart: 400,
      zEnd: 499,
    });
    const graphSmbgGl = new GraphSmbgGl({
      ...graphLayerCommonProps,
      zStart: 500,
      zEnd: 599,
    });
    const graphBolusGl = new GraphBolusGl({
      ...graphLayerCommonProps,
      zStart: 600,
      zEnd: 699,
    });
    const graphWizardGl = new GraphWizardGl({
      ...graphLayerCommonProps,
      zStart: 700,
      zEnd: 799,
    });
    this.graphRenderLayers = [
      graphYAxisGl,
      graphXAxisGl,
      graphBasalGl,
      graphCbgGl,
      graphNoteEventGl,
      graphSmbgGl,
      graphBolusGl,
      graphWizardGl,
    ];
  }

  renderScene() {
    if (!this.renderer) {
      // console.log(
      //   `GraphScrollableGl: renderScene: No renderer
      // );
      return;
    }

    if (!this.scene) {
      this.createScene();
    }

    if (this.scene) {
      // console.log(`GraphScrollableGl: renderScene`);

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
      // console.log(
      //   `GraphScrollableGl: renderScene: No scene
      // );
    }
  }

  render() {
    // console.log(`GraphScrollableGl: render`);

    const {
      graphScalableLayoutInfo: {
        graphFixedLayoutInfo: { width, height },
      },
    } = this.props;

    this.renderScene();

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
  cbgData: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  smbgData: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  basalData: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  bolusData: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  wizardData: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
};

GraphScrollableGl.defaultProps = {
  isZooming: false,
};

export default GraphScrollableGl;
