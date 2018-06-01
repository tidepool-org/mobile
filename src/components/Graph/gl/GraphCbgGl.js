import { THREE } from "expo-three";

import GraphRenderLayerGl from "./GraphRenderLayerGl";
import { MAX_BG_VALUE, convertHexColorStringToInt } from "../helpers";

class GraphCbgGl extends GraphRenderLayerGl {
  constructor(props) {
    super(props);

    // console.log(`GraphCbgGl ctor`);

    this.circleGeometry = new THREE.CircleBufferGeometry(
      3.5 * this.pixelRatio,
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
  }

  /* eslint-disable class-methods-use-this */
  hasDataToRender({ cbgData }) {
    return cbgData && cbgData.length > 0;
  }
  /* eslint-enable class-methods-use-this */

  renderSelf({ scene, graphScalableLayoutInfo, contentOffsetX, cbgData }) {
    // console.log(`GraphCbgGl renderSelf`);

    if (this.isScrollOrZoomRender) {
      // No need to render for scroll or zoom since we're only using auto-scrollable objects
      return;
    }

    const { pixelsPerSecond } = graphScalableLayoutInfo;
    for (let i = 0; i < cbgData.length; i += 1) {
      const { time, value, isLow, isHigh } = cbgData[i];
      const constrainedValue = Math.min(value, MAX_BG_VALUE);
      const timeOffset = time - this.graphStartTimeSeconds;
      const x = timeOffset;
      const y =
        this.graphFixedLayoutInfo.yAxisBottomOfGlucose -
        constrainedValue * this.graphFixedLayoutInfo.yAxisGlucosePixelsPerValue;

      let material = this.normalMaterial;
      if (isLow) {
        material = this.lowMaterial;
      } else if (isHigh) {
        material = this.highMaterial;
      }
      const object = new THREE.Mesh(this.circleGeometry, material);
      this.addAutoScrollableObjectToScene(scene, object, {
        x,
        y,
        z: this.zStart + i * 0.01,
        contentOffsetX,
        pixelsPerSecond,
        shouldScrollX: true,
      });
    }
  }
}

export default GraphCbgGl;
