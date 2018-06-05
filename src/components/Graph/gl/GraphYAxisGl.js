import { THREE } from "expo-three";

import GraphRenderLayerGl from "./GraphRenderLayerGl";
import GraphTextMeshFactory from "./GraphTextMeshFactory";
import { convertHexColorStringToInt } from "../helpers";

class GraphYAxisGl extends GraphRenderLayerGl {
  constructor(props) {
    // console.log(`GraphYAxisGl ctor`);
    super(props);

    const { width } = this.graphFixedLayoutInfo;

    this.lineDashedMaterial = new THREE.LineDashedMaterial({
      color: convertHexColorStringToInt(this.theme.graphLineStrokeColor),
      linewidth: 1.5 * this.pixelRatio,
      dashSize: 5 * this.pixelRatio,
      gapSize: 4 * this.pixelRatio,
    });
    const leftMargin = 30;
    const rightMargin = 4;
    const xStart = leftMargin * this.pixelRatio;
    const xEnd = width * this.pixelRatio - rightMargin * this.pixelRatio;
    this.lineGeometry = new THREE.Geometry();
    this.lineGeometry.vertices.push(
      new THREE.Vector3(xStart, 0, 0),
      new THREE.Vector3(xEnd, 0, 0)
    );

    this.yAxisBGBoundaryValueLines = new Map();
    this.yAxisLabelTextMeshes = new Map();
  }

  addLabelForValue({ scene, graphFixedLayoutInfo, value }) {
    const {
      yAxisBottomOfGlucose,
      yAxisGlucosePixelsPerValue,
    } = graphFixedLayoutInfo;

    // FIXME: We should really measure the text here for the width and height
    const width = 25;
    const height = 9;
    const text = value.toString();
    const { textMesh } = GraphTextMeshFactory.makeTextMesh({
      text,
      width,
      color: this.theme.graphYAxisLabelStyle.color,
      align: "right",
    });
    const y = Math.round(
      yAxisBottomOfGlucose - value * yAxisGlucosePixelsPerValue
    );
    this.updateObjectPosition(textMesh, {
      x: 0,
      y: y + height / 2,
      z: this.zStart,
    });
    this.yAxisLabelTextMeshes[value] = textMesh;
    scene.add(textMesh);
  }

  addLineForValue({ scene, graphFixedLayoutInfo, value }) {
    const {
      yAxisGlucosePixelsPerValue,
      yAxisBottomOfGlucose,
    } = graphFixedLayoutInfo;

    const y = Math.round(
      yAxisBottomOfGlucose - value * yAxisGlucosePixelsPerValue
    );
    const line = new THREE.Line(this.lineGeometry, this.lineDashedMaterial);
    line.computeLineDistances();
    this.updateObjectPosition(line, { x: 0, y, z: this.zStart });
    this.yAxisBGBoundaryValueLines[value] = line;
    scene.add(line);
  }

  renderSelf({
    scene,
    graphScalableLayoutInfo,
    yAxisBGBoundaryValues,
    yAxisLabelValues,
  }) {
    // console.log(`GraphYAxisGl renderSelf`);
    const { graphFixedLayoutInfo } = graphScalableLayoutInfo;

    // Hide existing lines
    /* eslint-disable no-param-reassign */
    this.yAxisBGBoundaryValueLines.forEach(value => {
      value.visible = false;
    });
    /* eslint-enable no-param-reassign */

    // Add new lines and/or show existing lines
    yAxisBGBoundaryValues.forEach(value => {
      if (this.yAxisBGBoundaryValueLines[value]) {
        // Show existing line for this value
        this.yAxisBGBoundaryValueLines[value].visible = true;
      } else {
        // Add new line for this value
        this.addLineForValue({
          scene,
          graphFixedLayoutInfo,
          value,
        });
      }
    });

    // Hide existing labels
    /* eslint-disable no-param-reassign */
    this.yAxisLabelTextMeshes.forEach(value => {
      value.visible = false;
    });
    /* eslint-enable no-param-reassign */
    // Add new labels and/or show existing labels
    yAxisLabelValues.forEach(value => {
      if (this.yAxisLabelTextMeshes[value]) {
        // Show existing label for this value
        this.yAxisLabelTextMeshes[value].visible = true;
      } else {
        // Add new label for this value
        this.addLabelForValue({
          scene,
          graphFixedLayoutInfo,
          value,
        });
      }
    });
  }
}

export default GraphYAxisGl;
