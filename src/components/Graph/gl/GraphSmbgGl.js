import { THREE } from "expo-three";

import GraphRenderLayerGl from "./GraphRenderLayerGl";
import GraphTextMeshFactory from "./GraphTextMeshFactory";
import { MAX_BG_VALUE, convertHexColorStringToInt } from "../helpers";

class GraphSmbgGl extends GraphRenderLayerGl {
  constructor(props) {
    super(props);

    // console.log(`GraphSmbgGl ctor`);

    this.circleGeometry = new THREE.CircleBufferGeometry(
      9 * this.pixelRatio,
      8 * this.pixelRatio
    );
    this.lowMaterial = new THREE.MeshBasicMaterial({
      color: convertHexColorStringToInt(this.theme.graphBgLowColor),
    });
    this.normalMaterial = new THREE.MeshBasicMaterial({
      color: convertHexColorStringToInt(this.theme.graphBgNormalColor),
    });
    this.highMaterial = new THREE.MeshBasicMaterial({
      color: convertHexColorStringToInt(this.theme.graphBgHighColor),
    });

    this.textHeight = 12;
    this.textWidth = 22;
    const rectangleShape = new THREE.Shape();
    rectangleShape.moveTo(-this.textWidth / 2 * this.pixelRatio, 0);
    rectangleShape.lineTo(this.textWidth / 2 * this.pixelRatio, 0);
    rectangleShape.lineTo(
      this.textWidth / 2 * this.pixelRatio,
      this.textHeight * this.pixelRatio
    );
    rectangleShape.lineTo(
      -this.textWidth / 2 * this.pixelRatio,
      this.textHeight * this.pixelRatio
    );
    rectangleShape.moveTo(-this.textWidth / 2 * this.pixelRatio, 0);
    this.textBackgroundGeometry = new THREE.ShapeGeometry(rectangleShape);
    this.textBackgroundMaterial = new THREE.MeshBasicMaterial({
      color: convertHexColorStringToInt(this.theme.graphBackgroundColor),
    });
  }

  /* eslint-disable class-methods-use-this */
  hasDataToRender({ smbgData }) {
    return smbgData && smbgData.length > 0;
  }
  /* eslint-enable class-methods-use-this */

  renderSelf({ scene, graphScalableLayoutInfo, contentOffsetX, smbgData }) {
    // console.log(`GraphSmbgGl renderSelf`);

    if (this.isScrollOrZoomRender) {
      // No need to render for scroll or zoom since we're only using auto-scrollable objects
      return;
    }

    const {
      pixelsPerSecond,
      graphStartTimeSeconds,
      graphEndTimeSeconds,
    } = graphScalableLayoutInfo;
    for (let i = 0; i < smbgData.length; i += 1) {
      const { time, value, isLow, isHigh } = smbgData[i];
      if (time >= graphStartTimeSeconds && time <= graphEndTimeSeconds) {
        // Add circle
        const constrainedValue = Math.min(value, MAX_BG_VALUE);
        const timeOffset = time - graphStartTimeSeconds;
        const x = timeOffset;
        const y =
          this.graphFixedLayoutInfo.yAxisBottomOfGlucose -
          constrainedValue *
            this.graphFixedLayoutInfo.yAxisGlucosePixelsPerValue;

        let color = this.theme.graphBgNormalColor;
        let material = this.normalMaterial;
        if (isLow) {
          material = this.lowMaterial;
          color = this.theme.graphBgLowColor;
        } else if (isHigh) {
          material = this.highMaterial;
          color = this.theme.graphBgHighColor;
        }
        let object = new THREE.Mesh(this.circleGeometry, material);
        this.addAutoScrollableObjectToScene(scene, object, {
          x,
          y,
          z: this.zStart + (i * 3 + 0) * 0.01,
          contentOffsetX,
          pixelsPerSecond,
          shouldScrollX: true,
        });

        // Add text background
        object = new THREE.Mesh(
          this.textBackgroundGeometry,
          this.textBackgroundMaterial
        );
        this.addAutoScrollableObjectToScene(scene, object, {
          x,
          y: y + 24,
          z: this.zStart + (i * 3 + 1) * 0.01,
          contentOffsetX,
          pixelsPerSecond,
          shouldScrollX: true,
        });

        // Add text
        const text = value.toString();
        object = GraphTextMeshFactory.makeTextMesh({
          text,
          width: this.textWidth,
          color,
        });
        this.addAutoScrollableObjectToScene(scene, object, {
          x,
          y: y + this.textHeight + 10,
          z: this.zStart + (i * 3 + 2) * 0.01,
          contentOffsetX,
          pixelsPerSecond,
          shouldScrollX: true,
          xFinalPixelAdjust: -this.textWidth * this.pixelRatio / 2,
        });
      }
    }
  }
}

export default GraphSmbgGl;
