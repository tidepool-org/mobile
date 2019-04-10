import { THREE } from "expo-three";

import GraphTextMeshFactory from "./GraphTextMeshFactory";
import GraphRenderLayerGl from "./GraphRenderLayerGl";
import { convertHexColorStringToInt } from "../helpers";
import { GraphLayoutConstants } from "../GraphFixedLayoutInfo";
// import Logger from "../../../models/Logger";

class GraphWizardGl extends GraphRenderLayerGl {
  constructor(props) {
    // console.log(`GraphWizardGl ctor`);

    super(props);

    this.circleMaterial = new THREE.MeshBasicMaterial({
      color: convertHexColorStringToInt(this.theme.graphWizardCircleColor),
    });
    this.circleOutlineGeometry = new THREE.CircleBufferGeometry(
      GraphLayoutConstants.wizardRadius * this.pixelRatio,
      8 * this.pixelRatio
    );
    this.circleGeometry = new THREE.CircleBufferGeometry(
      (GraphLayoutConstants.wizardRadius - 1) * this.pixelRatio,
      8 * this.pixelRatio
    );
    this.backgroundMaterial = new THREE.MeshBasicMaterial({
      color: convertHexColorStringToInt(this.theme.graphBackgroundColor),
    });
  }

  /* eslint-disable class-methods-use-this */
  hasDataToRender({ wizardData }) {
    return wizardData && wizardData.length > 0;
  }
  /* eslint-enable class-methods-use-this */

  renderCircle({ x, y, z }) {
    const circleOutline = new THREE.Mesh(
      this.circleOutlineGeometry,
      this.backgroundMaterial
    );
    this.addAutoScrollableObjectToScene(this.scene, circleOutline, {
      x,
      y,
      z,
      contentOffsetX: this.contentOffsetX,
      pixelsPerSecond: this.pixelsPerSecond,
      shouldScrollX: true,
    });
    const circle = new THREE.Mesh(this.circleGeometry, this.circleMaterial);
    this.addAutoScrollableObjectToScene(this.scene, circle, {
      x,
      y,
      z,
      contentOffsetX: this.contentOffsetX,
      pixelsPerSecond: this.pixelsPerSecond,
      shouldScrollX: true,
    });
  }

  renderLabel({ x, y, z, value }) {
    // Make text mesh
    const text = value.toString();
    const {
      textMesh,
      measuredWidth,
      capHeight,
    } = GraphTextMeshFactory.makeTextMesh({
      text,
      fontName: "OpenSans-Semibold-56px",
      color: this.theme.graphWizardLabelColor,
    });
    // Add text
    const xFinalPixelAdjust = (-measuredWidth / 2) * this.pixelRatio;
    this.addAutoScrollableObjectToScene(this.scene, textMesh, {
      x,
      y: y + capHeight / 2,
      z,
      contentOffsetX: this.contentOffsetX,
      pixelsPerSecond: this.pixelsPerSecond,
      shouldScrollX: true,
      //      xFinalPixelAdjust,
      xFinalPixelAdjust,
    });
  }

  renderSelf({ scene, graphScalableLayoutInfo, contentOffsetX, wizardData }) {
    if (this.isScrollOrZoomRender) {
      // No need to render for scroll or zoom since we're only using auto-scrollable objects
      return;
    }

    const {
      pixelsPerSecond,
      graphStartTimeSeconds,
      graphEndTimeSeconds,
    } = graphScalableLayoutInfo;

    this.scene = scene;
    this.contentOffsetX = contentOffsetX;
    this.pixelsPerSecond = pixelsPerSecond;
    this.wizardData = wizardData;

    for (let i = 0; i < wizardData.length; i += 1) {
      const { time, value } = wizardData[i];
      if (
        value &&
        time >= graphStartTimeSeconds &&
        time <= graphEndTimeSeconds
      ) {
        const timeOffset = time - graphStartTimeSeconds;
        const x = timeOffset;
        const y =
          GraphLayoutConstants.yAxisBottomOfWizard -
          GraphLayoutConstants.wizardRadius;
        const z = this.zStart + i * 0.01;

        this.renderCircle({
          x,
          y,
          z,
        });
        this.renderLabel({
          x,
          y,
          z,
          value,
        });
      }
    }
  }
}

export default GraphWizardGl;
