import { THREE } from "expo-three";

import GraphShapeGeometryFactory from "./GraphShapeGeometryFactory";
import GraphTextMeshFactory from "./GraphTextMeshFactory";
import GraphRenderLayerGl from "./GraphRenderLayerGl";
import { convertHexColorStringToInt } from "../helpers";

const BOLUS_RECT_WIDTH = 14;

class GraphBolusGl extends GraphRenderLayerGl {
  constructor(props) {
    super(props);

    this.backgroundMaterial = new THREE.MeshBasicMaterial({
      color: convertHexColorStringToInt(this.theme.graphBackgroundColor),
    });
    this.bolusRectMaterial = new THREE.MeshBasicMaterial({
      color: convertHexColorStringToInt(this.theme.graphBolusRectColor),
    });
  }

  makeBolusLabelTextMesh({ value }) {
    let formattedValue = value.toFixed(2);
    if (formattedValue.endsWith("0")) {
      formattedValue = value.toFixed(1);
    }

    // TODO: We should probably use the bold text like the legacy Tidepool Mobile iOS app. (Need a new bmfont for it.)
    return GraphTextMeshFactory.makeTextMesh({
      text: formattedValue,
      color: this.theme.graphBolusLabelColor,
    });
  }

  renderBolusLabel({
    x,
    z,
    textMesh,
    bolusLabelWidth,
    bolusLabelHeight,
    bolusLabelPadding,
    bolusRect,
  }) {
    const topBolusRectToBottomBolusLabel = 3;
    const y = bolusRect.y - bolusRect.height - topBolusRectToBottomBolusLabel;

    // Add bolus label background
    const textBackgroundGeometry = GraphShapeGeometryFactory.makeRectangleGeometry(
      {
        width: bolusLabelWidth + bolusLabelPadding,
        height: bolusLabelHeight + bolusLabelPadding,
      }
    );
    const object = new THREE.Mesh(
      textBackgroundGeometry,
      this.backgroundMaterial
    );
    this.addAutoScrollableObjectToScene(this.scene, object, {
      x,
      y: y - bolusLabelHeight / 2,
      z,
      contentOffsetX: this.contentOffsetX,
      pixelsPerSecond: this.pixelsPerSecond,
      shouldScrollX: true,
    });

    // Add bolus label
    this.addAutoScrollableObjectToScene(this.scene, textMesh, {
      x,
      y,
      z,
      contentOffsetX: this.contentOffsetX,
      pixelsPerSecond: this.pixelsPerSecond,
      shouldScrollX: true,
      xFinalPixelAdjust: (-bolusLabelWidth * this.pixelRatio) / 2,
    });
  }

  renderBolusRect({ x, z, value, bolusLabelHeight }) {
    const yAxisBolusPixelsPerValue =
      (this.yAxisBolusHeight - bolusLabelHeight - 8) / this.maxBolusValue;
    const width = BOLUS_RECT_WIDTH;
    const height = yAxisBolusPixelsPerValue * value;
    const y = this.yAxisBottomOfBolus;
    const centerY = y - height / 2;

    // Background rectangle (to provide visual separation when drawing near / on top each other)
    let geometry = GraphShapeGeometryFactory.makeRectangleGeometry({
      width,
      height,
    });
    let object = new THREE.Mesh(geometry, this.backgroundMaterial);
    this.addAutoScrollableObjectToScene(this.scene, object, {
      x,
      y: centerY,
      z,
      contentOffsetX: this.contentOffsetX,
      pixelsPerSecond: this.pixelsPerSecond,
      shouldScrollX: true,
    });

    // Bolus rectangle (inset from background)
    geometry = GraphShapeGeometryFactory.makeRectangleGeometry({
      width: width - 1,
      height: height - 1,
    });
    object = new THREE.Mesh(geometry, this.bolusRectMaterial);
    this.addAutoScrollableObjectToScene(this.scene, object, {
      x: x + 0.5,
      y: centerY,
      z,
      contentOffsetX: this.contentOffsetX,
      pixelsPerSecond: this.pixelsPerSecond,
      shouldScrollX: true,
    });

    return {
      x,
      y,
      width,
      height,
    };
  }

  /* eslint-disable class-methods-use-this */
  hasDataToRender({ bolusData }) {
    return bolusData && bolusData.length > 0;
  }
  /* eslint-enable class-methods-use-this */

  renderSelf({
    scene,
    graphScalableLayoutInfo,
    contentOffsetX,
    bolusData,
    maxBolusValue,
    minBolusScaleValue,
  }) {
    // console.log(`GraphBolusGl renderSelf`);

    if (this.isScrollOrZoomRender) {
      // No need to render for scroll or zoom since we're only using auto-scrollable objects
      return;
    }

    const {
      pixelsPerSecond,
      graphStartTimeSeconds,
      graphEndTimeSeconds,
    } = graphScalableLayoutInfo;

    const {
      yAxisBottomOfBolus,
      yAxisBolusHeight,
    } = graphScalableLayoutInfo.graphFixedLayoutInfo;

    this.scene = scene;
    this.contentOffsetX = contentOffsetX;
    this.pixelsPerSecond = pixelsPerSecond;
    this.maxBolusValue = maxBolusValue;
    this.yAxisBolusHeight = yAxisBolusHeight;
    this.yAxisBottomOfBolus = yAxisBottomOfBolus;

    for (let i = 0; i < bolusData.length; i += 1) {
      const { time, value } = bolusData[i];
      if (time >= graphStartTimeSeconds && time <= graphEndTimeSeconds) {
        const timeOffset = time - graphStartTimeSeconds;

        // Constrain bolus value
        let constrainedValue = value;
        if (
          constrainedValue > maxBolusValue &&
          constrainedValue > minBolusScaleValue
        ) {
          // console.error("max bolus exceeded!");
          constrainedValue = maxBolusValue;
        }

        // Set up x and z (constant for each mesh)
        const x = timeOffset;
        const z = this.zStart + i * 0.01;

        // Make bolus label text mesh
        const {
          textMesh,
          measuredWidth: bolusLabelWidth,
          capHeight,
        } = this.makeBolusLabelTextMesh({
          value,
        });
        const bolusLabelPadding = 0;
        const bolusLabelHeight = capHeight;

        // Render bolus rect
        const bolusRect = this.renderBolusRect({
          x,
          z,
          value,
          bolusLabelHeight,
        });

        // Render bolus label
        this.renderBolusLabel({
          x,
          z,
          textMesh,
          bolusLabelWidth,
          bolusLabelHeight,
          bolusLabelPadding,
          bolusRect,
        });
      }
    }
  }
}

export default GraphBolusGl;
