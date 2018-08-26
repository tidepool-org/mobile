import { THREE } from "expo-three";

import GraphTextMeshFactory from "./GraphTextMeshFactory";
import GraphRenderLayerGl from "./GraphRenderLayerGl";
import { convertHexColorStringToInt } from "../helpers";

const WIZARD_RADIUS = 15;
const WIZARD_BOTTOM_PADDING = 3;

class GraphWizardGl extends GraphRenderLayerGl {
  constructor(props) {
    // console.log(`GraphWizardGl ctor`);

    super(props);

    this.circleMaterial = new THREE.MeshBasicMaterial({
      color: convertHexColorStringToInt(this.theme.graphWizardCircleColor),
    });
    this.circleOutlineGeometry = new THREE.CircleBufferGeometry(
      WIZARD_RADIUS * this.pixelRatio,
      8 * this.pixelRatio
    );
    this.circleGeometry = new THREE.CircleBufferGeometry(
      (WIZARD_RADIUS - 1) * this.pixelRatio,
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

  bolusYAtPosition({ x }) {
    let bolusY;

    if (this.graphBolusGl) {
      const rectLeft = x - WIZARD_RADIUS;
      const rectRight = x + WIZARD_RADIUS;
      for (
        let i = 0;
        i < this.graphBolusGl.allCompleteBolusRects.length;
        i += 1
      ) {
        const bolusRect = this.graphBolusGl.allCompleteBolusRects[i];
        const bolusLeftX = bolusRect.x;
        const bolusRightX = bolusLeftX + bolusRect.width;
        if (bolusRightX > rectLeft && bolusLeftX < rectRight) {
          const previousHigh = bolusY || 0;
          if (bolusRect.height > previousHigh) {
            // return the bolusRect that is largest and intersects the x position of the target rect
            bolusY = bolusRect.height;
          }
        }
      }
    }

    return bolusY;
  }

  renderSelf({ scene, graphScalableLayoutInfo, contentOffsetX, wizardData }) {
    // console.log(`GraphWizardGl renderSelf`);

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
      const { time, value, bolusTopY } = wizardData[i];
      if (
        value &&
        time >= graphStartTimeSeconds &&
        time <= graphEndTimeSeconds
      ) {
        const timeOffset = time - graphStartTimeSeconds;
        const x = timeOffset;
        const z = this.zStart + i * 0.01;
        let y = bolusTopY;
        if (!y) {
          y = this.bolusYAtPosition({ x });
        }

        this.renderCircle({
          x,
          y: y - WIZARD_RADIUS - WIZARD_BOTTOM_PADDING,
          z,
        });
        this.renderLabel({
          x,
          y: y - WIZARD_RADIUS - WIZARD_BOTTOM_PADDING,
          z,
          value,
        });
      }
    }
  }
}

export default GraphWizardGl;
