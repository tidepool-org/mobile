import { THREE } from "./helpers";
import GraphRenderLayerGl from "./GraphRenderLayerGl";
import GraphTextMeshFactory from "./GraphTextMeshFactory";
import { calculateTimeMarkers, convertHexColorStringToInt } from "../helpers";

class GraphXAxisGl extends GraphRenderLayerGl {
  constructor(props) {
    super(props);

    // console.log(`GraphXAxisGl ctor`);

    // FIXME: Ideally the tickHeight should come from markerLengths (important if we add longer
    // tick for midnight, per TODO in calculateTimeMarkers). However, if we do that, we should
    // probably optimize to just have the two different geometries, one for normal tick, and one
    // for longer tick, and select the right one for each mesh instance
    this.tickHeight = 8;
    this.tickGeometry = new THREE.Geometry();
    this.tickGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
    this.tickGeometry.vertices.push(
      new THREE.Vector3(0, -this.tickHeight * this.pixelRatio, 0)
    );
    this.tickMaterial = new THREE.LineBasicMaterial({
      color: convertHexColorStringToInt(this.theme.graphLineStrokeColor),
      linewidth: 1.5 * this.pixelRatio,
    });
    this.tickLineMeshes = [];
    this.tickLabelTextMeshes = new Map();
    this.tickLabelTextWidth = 60;
  }

  render({ scene, graphScalableLayoutInfo, contentOffsetX }) {
    // console.log(`GraphXAxisGl render`);

    const { markerXCoordinates, markerLabels } = calculateTimeMarkers({
      graphScalableLayoutInfo,
    });
    this.renderTickLines({ scene, contentOffsetX, markerXCoordinates });
    this.renderTickLabels({
      scene,
      contentOffsetX,
      markerXCoordinates,
      markerLabels,
    });
  }

  renderTickLines({ scene, contentOffsetX, markerXCoordinates }) {
    // Add new tick lines to the scene if needed
    const meshesNeeded = markerXCoordinates.length - this.tickLineMeshes.length;
    for (let i = 0; i < meshesNeeded; i += 1) {
      const mesh = new THREE.Line(this.tickGeometry, this.tickMaterial);
      this.tickLineMeshes.push(mesh);
      scene.add(mesh);
    }

    // Position and show the tick lines for the scene
    let i = 0;
    for (; i < markerXCoordinates.length; i += 1) {
      const mesh = this.tickLineMeshes[i];
      const x = markerXCoordinates[i] - contentOffsetX;
      const y = this.graphFixedLayoutInfo.headerHeight - this.tickHeight;
      this.updateObjectPosition(mesh, { x, y, z: this.zStart + i * 0.01 });
      mesh.visible = true;
    }

    // Hide unused tick lines
    for (; i < this.tickLineMeshes.length; i += 1) {
      this.tickLineMeshes[i].visible = false;
    }
  }

  renderTickLabels({
    scene,
    contentOffsetX,
    markerXCoordinates,
    markerLabels,
  }) {
    // Add new tick labels to the scene if necessary
    markerLabels.forEach(text => {
      if (!this.tickLabelTextMeshes.get(text)) {
        const mesh = GraphTextMeshFactory.makeTextMesh({
          text,
          width: this.tickLabelTextWidth,
          color: convertHexColorStringToInt("#58595b"),
        });
        this.tickLabelTextMeshes.set(text, mesh);
        scene.add(mesh);
      }
    });

    // Hide all the labels
    this.tickLabelTextMeshes.forEach(mesh => {
      const meshToHide = mesh;
      meshToHide.visible = false;
    });

    // Position and show the labels that should be visible
    for (let i = 0; i < markerXCoordinates.length; i += 1) {
      const x = markerXCoordinates[i] - contentOffsetX;
      const y = this.graphFixedLayoutInfo.headerHeight - this.tickHeight;
      const text = markerLabels[i];
      const mesh = this.tickLabelTextMeshes.get(text);
      this.updateObjectPosition(mesh, {
        x: x - this.tickLabelTextWidth / 2,
        y: y - 3,
        z: this.zStart + i * 0.01,
      });
      mesh.visible = true;
    }
  }
}

export default GraphXAxisGl;
