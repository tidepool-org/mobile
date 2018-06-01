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

  renderSelf({ scene, graphScalableLayoutInfo, contentOffsetX }) {
    // console.log(`GraphNoteEventGl renderSelf`);

    if (this.isScrollOrZoomRender) {
      // No need to render for scroll or zoom since we're only using auto-scrollable objects
      return;
    }

    const {
      eventTimeSeconds,
      graphStartTimeSeconds,
      pixelsPerSecond,
    } = graphScalableLayoutInfo;

    const timeIntervalSeconds = eventTimeSeconds - graphStartTimeSeconds;
    const x = timeIntervalSeconds;
    const y = 0;

    // Add tick line to scene
    let object = new THREE.Line(this.tickLineGeometry, this.tickLineMaterial);
    this.addAutoScrollableObjectToScene(scene, object, {
      x,
      y,
      z: this.zStart,
      contentOffsetX,
      pixelsPerSecond,
      shouldScrollX: true,
    });

    // Add tick triangle to scene
    object = new THREE.Mesh(
      this.tickTriangleGeometry,
      this.tickTriangleMaterial
    );
    this.addAutoScrollableObjectToScene(scene, object, {
      x,
      y,
      z: this.zStart,
      contentOffsetX,
      pixelsPerSecond,
      shouldScrollX: true,
    });
  }
}

export default GraphNoteEventGl;
