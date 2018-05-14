import { THREE } from "expo-three";

import GraphRenderLayerGl from "./GraphRenderLayerGl";

class GraphNoteEventGl extends GraphRenderLayerGl {
  constructor(props) {
    super(props);

    // console.log(`GraphNoteEventGl ctor`);

    const tickLineHeight = this.graphFixedLayoutInfo.height;
    this.tickLineGeometry = new THREE.Geometry();
    this.tickLineGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
    this.tickLineGeometry.vertices.push(
      new THREE.Vector3(0, -tickLineHeight * this.pixelRatio, 0)
    );
    this.tickLineMaterial = new THREE.LineBasicMaterial({
      color: 0x000000,
      linewidth: 1.5 * this.pixelRatio,
    });

    const tickTriangleWidth = 16;
    const tickTriangleHeight = Math.sqrt(
      tickTriangleWidth * tickTriangleWidth - tickTriangleWidth / 2
    );
    const tickTriangleShape = new THREE.Shape();
    tickTriangleShape.moveTo(-tickTriangleWidth / 2 * this.pixelRatio, 0);
    tickTriangleShape.lineTo(tickTriangleWidth / 2 * this.pixelRatio, 0);
    tickTriangleShape.lineTo(0, -tickTriangleHeight * this.pixelRatio);
    tickTriangleShape.lineTo(-tickTriangleWidth / 2 * this.pixelRatio, 0);
    this.tickTriangleGeometry = new THREE.ShapeGeometry(tickTriangleShape);
    this.tickTriangleMaterial = new THREE.MeshBasicMaterial({
      color: 0x000000,
    });
  }

  render({ scene, graphScalableLayoutInfo, contentOffsetX }) {
    // console.log(`GraphNoteEventGl render`);

    const {
      eventTimeSeconds,
      graphStartTimeSeconds,
      pixelsPerSecond,
    } = graphScalableLayoutInfo;

    const timeIntervalSeconds = eventTimeSeconds - graphStartTimeSeconds;
    const x =
      Math.round(pixelsPerSecond * timeIntervalSeconds) - contentOffsetX;
    const y = 0;

    // Add tick line to scene
    if (!this.tickLineMesh) {
      this.tickLineMesh = new THREE.Line(
        this.tickLineGeometry,
        this.tickLineMaterial
      );
      scene.add(this.tickLineMesh);
    }
    this.updateObjectPosition(this.tickLineMesh, { x, y, z: this.zStart });

    // Add tick triangle to scene
    if (!this.tickTriangleMesh) {
      this.tickTriangleMesh = new THREE.Mesh(
        this.tickTriangleGeometry,
        this.tickTriangleMaterial
      );
      scene.add(this.tickTriangleMesh);
    }
    this.updateObjectPosition(this.tickTriangleMesh, { x, y, z: this.zStart });
  }
}

export default GraphNoteEventGl;
