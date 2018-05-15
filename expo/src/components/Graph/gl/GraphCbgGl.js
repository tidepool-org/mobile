import { THREE } from "./helpers";
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

  render({ scene, cbgData, graphScalableLayoutInfo, contentOffsetX }) {
    // console.log(`GraphCbgGl render`);

    if (!cbgData || cbgData.length === 0) {
      return;
    }

    const { pixelsPerSecond } = graphScalableLayoutInfo;
    const updateExistingMeshes = this.hasRenderedAtLeastOnce;
    if (!updateExistingMeshes) {
      this.meshIndexStart = scene.children.length;
    }
    for (let i = 0; i < cbgData.length; i += 1) {
      const { time, value, isLow, isHigh } = cbgData[i];
      let material = this.normalMaterial;
      if (isLow) {
        material = this.lowMaterial;
      } else if (isHigh) {
        material = this.highMaterial;
      }
      const constrainedValue = Math.min(value, MAX_BG_VALUE);
      const deltaTime = time - this.graphStartTimeSeconds;
      const x = deltaTime * pixelsPerSecond - contentOffsetX;
      const y =
        this.graphFixedLayoutInfo.headerHeight +
        (this.graphFixedLayoutInfo.yAxisHeightInPixels -
          constrainedValue * this.graphFixedLayoutInfo.yAxisPixelsPerValue);

      let mesh;
      if (updateExistingMeshes) {
        mesh = scene.children[this.meshIndexStart + i];
      } else {
        mesh = new THREE.Mesh(this.circleGeometry, material);
        scene.add(mesh);
      }
      this.updateObjectPosition(mesh, { x, y, z: this.zStart + i * 0.01 });
    }

    this.hasRenderedAtLeastOnce = true;
  }
}

export default GraphCbgGl;
