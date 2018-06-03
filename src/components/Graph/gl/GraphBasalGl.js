import { THREE } from "expo-three";

import GraphRenderLayerGl from "./GraphRenderLayerGl";
import { convertHexColorStringToInt } from "../helpers";

class GraphBasalGl extends GraphRenderLayerGl {
  constructor(props) {
    super(props);

    // FIXME: It seems that the LineDashedMaterial will clip dashes at the end, rather than hiding
    // them, if they don't fit. Ideally we want hide behavior, not clip (similar to the dashed
    // UIBezierPath in the old iOS Tidepool Mobile app).
    this.suppressedLineMaterial = new THREE.LineDashedMaterial({
      color: convertHexColorStringToInt(this.theme.graphBasalLineColor),
      linewidth: 2 * this.pixelRatio,
      dashSize: 2 * this.pixelRatio,
      gapSize: 4 * this.pixelRatio,
    });
    this.basalRectMaterial = new THREE.MeshBasicMaterial({
      color: convertHexColorStringToInt(this.theme.graphBasalRectColor),
    });
  }

  renderBasalRect({ startTimeOffset, endTimeOffset, value }) {
    const { contentOffsetX, pixelsPerSecond } = this;
    const width = endTimeOffset - startTimeOffset;
    const height = this.yAxisBasalPixelsPerValue * value;

    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.lineTo(width * this.pixelRatio, 0);
    shape.lineTo(width * this.pixelRatio, height * this.pixelRatio);
    shape.lineTo(0, height * this.pixelRatio);
    shape.moveTo(0, 0);
    const geometry = new THREE.ShapeGeometry(shape);
    const object = new THREE.Mesh(geometry, this.basalRectMaterial);
    this.addAutoScrollableObjectToScene(this.scene, object, {
      x: startTimeOffset,
      y: this.yAxisBottomOfBasal,
      z: this.zStart,
      contentOffsetX,
      pixelsPerSecond,
      shouldScrollX: true,
      shouldScaleX: true,
    });

    return {
      x: startTimeOffset,
      y: 0,
      width,
      height,
    };
  }

  updateSuppressedLineMaterial() {
    this.suppressedLineMaterial.dashSize =
      (4 * this.pixelRatio) / this.graphScalableLayoutInfo.pixelsPerSecond;
    this.suppressedLineMaterial.gapSize =
      (2 * this.pixelRatio) / this.graphScalableLayoutInfo.pixelsPerSecond;
  }

  renderSuppressedLine() {
    if (this.suppressedLinePath) {
      const points = this.suppressedLinePath.getPoints();
      const geometry = new THREE.Geometry().setFromPoints(points);
      const { contentOffsetX, pixelsPerSecond } = this;
      const line = new THREE.Line(geometry, this.suppressedLineMaterial);
      this.updateSuppressedLineMaterial();
      this.addAutoScrollableObjectToScene(this.scene, line, {
        x: 0,
        y: this.yAxisBottomOfBasal,
        z: this.zStart,
        contentOffsetX,
        pixelsPerSecond,
        shouldScrollX: true,
        shouldScaleX: true,
      });

      // NOTE: computeLineDistances is Necessary to compute dashed material for the line, else the
      // line won't be dashed
      line.computeLineDistances();

      // Now that we've finished/added the line to the scene, reset so we can start next line
      this.suppressedLinePath = null;
    }
  }

  renderSuppressedLinePath({ basalRect, suppressedRate, finish }) {
    if (suppressedRate === null) {
      if (this.suppressedLinePath) {
        this.renderSuppressedLine();
      }
    } else {
      const suppressedStartPoint = {
        x: basalRect.x + 1,
        y: this.yAxisBasalPixelsPerValue * suppressedRate - 1,
      };
      const suppressedEndPoint = {
        x: suppressedStartPoint.x + basalRect.width - 2.0,
        y: suppressedStartPoint.y,
      };
      if (!this.suppressedLinePath) {
        // Start a new line
        this.suppressedLinePath = new THREE.Path();
        this.suppressedLinePath.moveTo(
          suppressedStartPoint.x * this.pixelRatio,
          suppressedStartPoint.y * this.pixelRatio
        );
      } else {
        // Continue an existing suppressed line path by adding connecting line segment if it's at a
        // different y
        const currentEndPointArray = this.suppressedLinePath.currentPoint;
        const currentEndPoint = {
          x: currentEndPointArray[0],
          y: currentEndPointArray[1],
        };
        if (currentEndPoint.y !== suppressedStartPoint.y / this.pixelRatio) {
          this.suppressedLinePath.lineTo(
            suppressedStartPoint.x * this.pixelRatio,
            suppressedStartPoint.y * this.pixelRatio
          );
        }
      }
      // Add current line segment to the line
      this.suppressedLinePath.lineTo(
        suppressedEndPoint.x * this.pixelRatio,
        suppressedEndPoint.y * this.pixelRatio
      );
      if (finish) {
        this.renderSuppressedLine();
      }
    }
  }

  /* eslint-disable class-methods-use-this */
  hasDataToRender({ basalData }) {
    return basalData && basalData.length > 0;
  }
  /* eslint-enable class-methods-use-this */

  renderSelf({
    scene,
    graphScalableLayoutInfo,
    contentOffsetX,
    basalData,
    maxBasalValue,
  }) {
    // console.log(`GraphBasalGl renderSelf`);

    const {
      pixelsPerSecond,
      graphStartTimeSeconds,
      graphEndTimeSeconds,
    } = graphScalableLayoutInfo;
    this.scene = scene;
    this.basalData = basalData;
    this.maxBasalValue = maxBasalValue;
    this.graphScalableLayoutInfo = graphScalableLayoutInfo;
    this.contentOffsetX = contentOffsetX;
    this.pixelsPerSecond = pixelsPerSecond;
    this.yAxisBasalPixelsPerValue =
      graphScalableLayoutInfo.graphFixedLayoutInfo.yAxisBasalHeight /
      maxBasalValue;
    this.yAxisBottomOfBasal =
      graphScalableLayoutInfo.graphFixedLayoutInfo.yAxisBottomOfBasal;

    if (this.isScrollOrZoomRender) {
      // During zoom, update dashed lines with new dashed line material with new pixelsPerSecond
      // (during zoom) so that the dashed lines appear the same width at all zoom levels.
      // FIXME: Ideally we should plumb support for detecting renders due to zoom or scroll
      // (distinguishing between them), rather than treating the same. We don't need to update the
      // materials of the lines during scroll, only during zoom!
      this.updateSuppressedLineMaterial();

      // Return early since all our objects are auto-updated during zoom/scale, so, no need for any
      // further rendering (other than the update to the line dashed material above)
      return;
    }

    this.startValue = 0;
    this.startTimeOffset = 0;
    this.startSuppressedRate = null;
    this.suppressedLinePath = null;

    for (let i = 0; i < basalData.length; i += 1) {
      const { time, value, suppressedRate } = basalData[i];
      const timeOffset = time - graphStartTimeSeconds;

      if (time > graphEndTimeSeconds) {
        // Values are sorted by time, stop if we get to any values that are beyond the end of the
        // graph
        break;
      } else if (time < graphStartTimeSeconds) {
        // Skip over values before graph start time, but remember last value
        this.startValue = value;
        this.startSuppressedRate = suppressedRate;
      } else if (this.startValue === 0.0 && this.startSuppressedRate === null) {
        if (value > 0.0 || suppressedRate !== null) {
          // Just starting a rect, note the time...
          this.startTimeOffset = timeOffset;
          this.startValue = value;
          this.startSuppressedRate = suppressedRate;
        }
      } else {
        // Got another value, render the rect and line path
        const basalRect = this.renderBasalRect({
          startTimeOffset: this.startTimeOffset,
          endTimeOffset: timeOffset,
          value: this.startValue,
        });
        this.renderSuppressedLinePath({
          basalRect,
          suppressedRate: this.startSuppressedRate,
          finish: timeOffset === graphEndTimeSeconds,
        });

        // And start another rect
        this.startValue = value;
        this.startTimeOffset = timeOffset;
        this.startSuppressedRate = suppressedRate;
      }
    }

    // Finish off any rect/suppressed line we started, to right edge of graph
    if (this.startValue > 0.0 || this.startSuppressedRate !== null) {
      const basalRect = this.renderBasalRect({
        startTimeOffset: this.startTimeOffset,
        endTimeOffset: graphScalableLayoutInfo.timeIntervalSeconds,
        value: this.startValue,
      });
      this.renderSuppressedLinePath({
        basalRect,
        suppressedRate: this.startSuppressedRate,
        finish: true,
      });
    }
  }
}

export default GraphBasalGl;
