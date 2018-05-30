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

  render({ scene, smbgData, graphScalableLayoutInfo, contentOffsetX }) {
    // console.log(`GraphSmbgGl render`);

    if (!smbgData || smbgData.length === 0) {
      return;
    }

    const { pixelsPerSecond } = graphScalableLayoutInfo;
    const updateExistingMeshes = this.hasRenderedAtLeastOnce;
    if (!updateExistingMeshes) {
      this.meshIndexStart = scene.children.length;
    }
    for (let i = 0; i < smbgData.length; i += 1) {
      const { time, value, isLow, isHigh } = smbgData[i];

      // Add circle
      const constrainedValue = Math.min(value, MAX_BG_VALUE);
      const deltaTime = time - this.graphStartTimeSeconds;
      const x = deltaTime * pixelsPerSecond - contentOffsetX;
      const y =
        this.graphFixedLayoutInfo.yAxisBottomOfGlucose -
        constrainedValue * this.graphFixedLayoutInfo.yAxisGlucosePixelsPerValue;

      let mesh;
      let color = this.theme.graphBgNormalColor;
      if (updateExistingMeshes) {
        mesh = scene.children[this.meshIndexStart + i * 3];
      } else {
        let material = this.normalMaterial;
        if (isLow) {
          material = this.lowMaterial;
          color = this.theme.graphBgLowColor;
        } else if (isHigh) {
          material = this.highMaterial;
          color = this.theme.graphBgHighColor;
        }
        mesh = new THREE.Mesh(this.circleGeometry, material);
        scene.add(mesh);
      }
      this.updateObjectPosition(mesh, {
        x,
        y,
        z: this.zStart + (i * 3 + 0) * 0.01,
      });

      // Add text background
      if (updateExistingMeshes) {
        mesh = scene.children[this.meshIndexStart + i * 3 + 1];
      } else {
        mesh = new THREE.Mesh(
          this.textBackgroundGeometry,
          this.textBackgroundMaterial
        );
        scene.add(mesh);
      }
      this.updateObjectPosition(mesh, {
        x,
        y: y + 24,
        z: this.zStart + (i * 3 + 1) * 0.01,
      });

      // Add text
      if (updateExistingMeshes) {
        mesh = scene.children[this.meshIndexStart + i * 3 + 2];
      } else {
        const text = value.toString();
        mesh = GraphTextMeshFactory.makeTextMesh({
          text,
          width: this.textWidth,
          color,
        });
        scene.add(mesh);
      }
      this.updateObjectPosition(mesh, {
        x: x - this.textWidth / 2,
        y: y + this.textHeight + 10,
        z: this.zStart + (i * 3 + 2) * 0.01,
      });
    }

    this.hasRenderedAtLeastOnce = true;
  }
}

export default GraphSmbgGl;
