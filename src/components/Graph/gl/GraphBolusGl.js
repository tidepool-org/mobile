import { THREE } from "expo-three";

import GraphShapeGeometryFactory from "./GraphShapeGeometryFactory";
import GraphTextMeshFactory from "./GraphTextMeshFactory";
import GraphRenderLayerGl from "./GraphRenderLayerGl";
import { convertHexColorStringToInt } from "../helpers";
import Logger from "../../../models/Logger";

const EXTENSION_INTERRUPT_BAR_WIDTH = 6.0;
const EXTENSION_END_SHAPE_WIDTH = 7.0;
const EXTENSION_END_SHAPE_HEIGHT = 11.0;
const EXTENSION_LINE_HEIGHT = 2.0;
const BOLUS_RECT_WIDTH = 14;

class GraphBolusGl extends GraphRenderLayerGl {
  constructor(props) {
    super(props);

    this.backgroundMaterial = new THREE.MeshBasicMaterial({
      color: convertHexColorStringToInt(this.theme.graphBackgroundColor),
    });
    this.bolusRectMaterial = new THREE.MeshBasicMaterial({
      color: convertHexColorStringToInt(this.theme.graphBolusRectColor),
    });
    this.bolusInterruptBarMaterial = new THREE.MeshBasicMaterial({
      color: convertHexColorStringToInt(this.theme.graphBolusInterruptBarColor),
    });
    this.overrideBarLineMaterial = new THREE.LineDashedMaterial({
      color: convertHexColorStringToInt(this.theme.graphBolusOverrideLine),
      linewidth: 1 * this.pixelRatio,
      dashSize: 2 * this.pixelRatio,
      gapSize: 2 * this.pixelRatio,
    });
    this.bolusExtensionDashedLineMaterial = new THREE.LineDashedMaterial({
      color: convertHexColorStringToInt(this.theme.graphBolusRectColor),
      linewidth: 1 * this.pixelRatio,
      dashSize: 2 * this.pixelRatio,
      gapSize: 2 * this.pixelRatio,
    });
    this.bolusExtensionDashedArrowMaterial = new THREE.LineDashedMaterial({
      color: convertHexColorStringToInt(this.theme.graphBolusRectColor),
      linewidth: 1 * this.pixelRatio,
      dashSize: 2 * this.pixelRatio,
      gapSize: 2 * this.pixelRatio,
    });

    this.bolusOverrideUpIconGeometry = this.makeBolusOverrideIconGeometry({
      isUp: true,
    });
    this.bolusOverrideDownIconGeometry = this.makeBolusOverrideIconGeometry({
      isUp: false,
    });
    this.bolusOverrideIconMaterial = new THREE.MeshBasicMaterial({
      color: convertHexColorStringToInt(this.theme.bolusOverrideIconColor),
    });

    this.allCompleteBolusRects = [];
  }

  updateBolusExtensionDashedLineMaterial() {
    this.bolusExtensionDashedLineMaterial.dashSize =
      (2 * this.pixelRatio) / this.pixelsPerSecond;
    this.bolusExtensionDashedLineMaterial.gapSize =
      (2 * this.pixelRatio) / this.pixelsPerSecond;
  }

  makeBolusOverrideIconGeometry({ isUp }) {
    const bolusOverrideIconShape = new THREE.Shape();
    const flip = isUp ? 1.0 : -1.0;
    const width = 13;
    const baseHeight = 3.5;
    const arrowWidth = 6.5;
    const arrowHeight = 3.0;
    bolusOverrideIconShape.moveTo((-width / 2) * this.pixelRatio, 0);
    bolusOverrideIconShape.lineTo(
      (-width / 2) * this.pixelRatio,
      flip * baseHeight * this.pixelRatio
    );
    bolusOverrideIconShape.lineTo(
      (-arrowWidth / 2) * this.pixelRatio,
      flip * baseHeight * this.pixelRatio
    );
    bolusOverrideIconShape.lineTo(
      0,
      flip * (baseHeight + arrowHeight) * this.pixelRatio
    );
    bolusOverrideIconShape.lineTo(
      (arrowWidth / 2) * this.pixelRatio,
      flip * baseHeight * this.pixelRatio
    );
    bolusOverrideIconShape.lineTo(
      (width / 2) * this.pixelRatio,
      flip * baseHeight * this.pixelRatio
    );
    bolusOverrideIconShape.lineTo((width / 2) * this.pixelRatio, 0);
    bolusOverrideIconShape.lineTo(-(width / 2) * this.pixelRatio, 0);
    return new THREE.ShapeGeometry(bolusOverrideIconShape);
  }

  renderBolusRectBackground({ x, z }) {
    const { width, height, y } = this.bolusWithOverrideRect;
    const centerY = y - height / 2;
    const geometry = GraphShapeGeometryFactory.makeRectangleGeometry({
      width,
      height,
    });
    const object = new THREE.Mesh(geometry, this.backgroundMaterial);
    this.addAutoScrollableObjectToScene(this.scene, object, {
      x,
      y: centerY,
      z,
      contentOffsetX: this.contentOffsetX,
      pixelsPerSecond: this.pixelsPerSecond,
      shouldScrollX: true,
    });
  }

  makeBolusLabelTextMesh({ value }) {
    let formattedValue = value.toFixed(2);
    if (formattedValue.endsWith("0")) {
      formattedValue = value.toFixed(1);
    }

    return GraphTextMeshFactory.makeTextMesh({
      text: formattedValue,
      fontName: "OpenSans-Semibold-56px",
      color: this.theme.graphBolusLabelColor,
    });
  }

  renderBolusLabel({
    x,
    z,
    textMesh,
    bolusLabelWidth,
    bolusLabelHeight,
    bolusLabelPadding,
  }) {
    const topBolusRectToBottomBolusLabel = 3;
    const y =
      this.bolusWithOverrideRect.y -
      this.bolusWithOverrideRect.height -
      topBolusRectToBottomBolusLabel;

    // Add bolus label background
    const textBackgroundGeometry = GraphShapeGeometryFactory.makeRectangleGeometry(
      {
        width: bolusLabelWidth + bolusLabelPadding,
        height: bolusLabelHeight + bolusLabelPadding,
      }
    );
    const object = new THREE.Mesh(
      textBackgroundGeometry,
      this.backgroundMaterial
    );
    this.addAutoScrollableObjectToScene(this.scene, object, {
      x,
      y: y - bolusLabelHeight / 2,
      z,
      contentOffsetX: this.contentOffsetX,
      pixelsPerSecond: this.pixelsPerSecond,
      shouldScrollX: true,
    });

    // Add bolus label
    const xFinalPixelAdjust = (-bolusLabelWidth * this.pixelRatio) / 2;
    this.addAutoScrollableObjectToScene(this.scene, textMesh, {
      x,
      y,
      z,
      contentOffsetX: this.contentOffsetX,
      pixelsPerSecond: this.pixelsPerSecond,
      shouldScrollX: true,
      xFinalPixelAdjust,
    });

    this.completeBolusRect = {
      ...this.bolusWithOverrideRect,
      height: this.bolusWithOverrideRect.y - y + bolusLabelHeight,
    };
  }

  renderBolusInterruptBar({ x, y, z }) {
    const width = BOLUS_RECT_WIDTH;
    const height = 3.5;
    const centerY = y - height / 2;

    const geometry = GraphShapeGeometryFactory.makeRectangleGeometry({
      width: width - 1,
      height,
    });
    const mesh = new THREE.Mesh(geometry, this.bolusInterruptBarMaterial);
    this.addAutoScrollableObjectToScene(this.scene, mesh, {
      x: x + 0.5,
      y: centerY + height - 0.5,
      z,
      contentOffsetX: this.contentOffsetX,
      pixelsPerSecond: this.pixelsPerSecond,
      shouldScrollX: true,
    });
  }

  renderBolusOverrideIcon({ x, y, z, isUp }) {
    const object = new THREE.Mesh(
      isUp
        ? this.bolusOverrideUpIconGeometry
        : this.bolusOverrideDownIconGeometry,
      this.bolusOverrideIconMaterial
    );
    this.addAutoScrollableObjectToScene(this.scene, object, {
      x,
      y: y + (isUp ? 0.5 : -0.5),
      z,
      contentOffsetX: this.contentOffsetX,
      pixelsPerSecond: this.pixelsPerSecond,
      shouldScrollX: true,
    });
  }

  renderBolusOverrideBar({ z }) {
    const y =
      this.yAxisBottomOfBolus -
      this.yAxisBolusPixelsPerValue * this.originalValue;
    const height =
      this.yAxisBolusPixelsPerValue *
      (this.originalValue - this.constrainedBolusValue);
    const rect = {
      x: this.bolusWithOverrideRect.x + 1.0,
      y,
      width: this.bolusWithOverrideRect.width - 2,
      height,
    };
    this.bolusWithOverrideRect.height += height;

    const centerY = rect.y + rect.height / 2;
    const rectangleGeometry = GraphShapeGeometryFactory.makeRectangleGeometry({
      width: rect.width,
      height: rect.height,
    });
    rectangleGeometry.computeLineDistances();
    const rectangleEdgesGeometry = new THREE.EdgesGeometry(rectangleGeometry);
    const rectangleLines = new THREE.LineSegments(
      rectangleEdgesGeometry,
      this.overrideBarLineMaterial
    );

    this.addAutoScrollableObjectToScene(this.scene, rectangleLines, {
      x: rect.x,
      y: centerY,
      z,
      contentOffsetX: this.contentOffsetX,
      pixelsPerSecond: this.pixelsPerSecond,
      shouldScrollX: true,
    });
  }

  renderBolusRect({ x, z }) {
    const width = BOLUS_RECT_WIDTH;
    const height = Math.ceil(
      this.yAxisBolusPixelsPerValue * this.constrainedBolusValue
    );
    const y = this.yAxisBottomOfBolus;
    const centerY = y - height / 2;

    const geometry = GraphShapeGeometryFactory.makeRectangleGeometry({
      width: width - 1,
      height: height - 1,
    });
    const mesh = new THREE.Mesh(geometry, this.bolusRectMaterial);
    this.addAutoScrollableObjectToScene(this.scene, mesh, {
      x: x + 0.5,
      y: centerY,
      z,
      contentOffsetX: this.contentOffsetX,
      pixelsPerSecond: this.pixelsPerSecond,
      shouldScrollX: true,
    });

    this.bolusRect = {
      x,
      y,
      width,
      height,
    };

    this.bolusWithOverrideRect = {
      ...this.bolusRect,
    };
  }

  renderBolusExtensionShape({ x, z, centerY, width, borderOnly, noEndShape }) {
    const xFinalPixelAdjust = (this.bolusRect.width / 2) * this.pixelRatio;

    if (noEndShape) {
      // Line
      const lineShape = new THREE.Shape();
      lineShape.moveTo(0, (-EXTENSION_LINE_HEIGHT / 2) * this.pixelRatio);
      lineShape.lineTo(
        (width / this.pixelsPerSecond) * this.pixelRatio,
        (-EXTENSION_LINE_HEIGHT / 2) * this.pixelRatio
      );
      lineShape.lineTo(
        (width / this.pixelsPerSecond) * this.pixelRatio,
        (EXTENSION_LINE_HEIGHT / 2) * this.pixelRatio
      );
      lineShape.lineTo(0, (EXTENSION_LINE_HEIGHT / 2) * this.pixelRatio);
      lineShape.lineTo(0, -(EXTENSION_LINE_HEIGHT / 2) * this.pixelRatio);
      let line;
      if (borderOnly) {
        const points = lineShape.getPoints();
        const geometry = new THREE.Geometry().setFromPoints(points);
        this.updateBolusExtensionDashedLineMaterial();
        geometry.computeLineDistances();
        line = new THREE.Line(geometry, this.bolusExtensionDashedLineMaterial);
      } else {
        const lineGeometry = new THREE.ShapeGeometry(lineShape);
        line = new THREE.Mesh(lineGeometry, this.bolusRectMaterial);
      }
      this.addAutoScrollableObjectToScene(this.scene, line, {
        x,
        y: centerY + 0.5,
        z,
        contentOffsetX: this.contentOffsetX,
        pixelsPerSecond: this.pixelsPerSecond,
        shouldScrollX: true,
        shouldScaleX: true,
        xFinalPixelAdjust,
      });
    } else {
      // Arrow
      const arrowShape = new THREE.Shape();
      arrowShape.moveTo(0, (-EXTENSION_LINE_HEIGHT / 2) * this.pixelRatio);
      arrowShape.lineTo(
        EXTENSION_END_SHAPE_WIDTH * this.pixelRatio,
        -(EXTENSION_END_SHAPE_HEIGHT / 2) * this.pixelRatio
      );
      arrowShape.lineTo(
        EXTENSION_END_SHAPE_WIDTH * this.pixelRatio,
        (EXTENSION_END_SHAPE_HEIGHT / 2) * this.pixelRatio
      );
      arrowShape.lineTo(0, (EXTENSION_LINE_HEIGHT / 2) * this.pixelRatio);
      arrowShape.lineTo(0, (-EXTENSION_LINE_HEIGHT / 2) * this.pixelRatio);
      let arrow;
      if (borderOnly) {
        const points = arrowShape.getPoints();
        const geometry = new THREE.Geometry().setFromPoints(points);
        geometry.computeLineDistances();
        arrow = new THREE.Line(
          geometry,
          this.bolusExtensionDashedArrowMaterial
        );
        // FIXME: The dashed line encroaches the arrow to the right side of arrow and looks bad in
        // some scenarios. We should fix this. (Not a trivial fix.)
      } else {
        const geometry = new THREE.ShapeGeometry(arrowShape);
        arrow = new THREE.Mesh(geometry, this.bolusRectMaterial);
      }
      this.addAutoScrollableObjectToScene(this.scene, arrow, {
        x: x + width / this.pixelsPerSecond,
        y: centerY + 0.5,
        z,
        contentOffsetX: this.contentOffsetX,
        pixelsPerSecond: this.pixelsPerSecond,
        shouldScrollX: true,
        shouldScaleX: false,
        xFinalPixelAdjust:
          xFinalPixelAdjust - EXTENSION_END_SHAPE_WIDTH * this.pixelRatio,
      });

      // Line
      const lineShape = new THREE.Shape();
      lineShape.moveTo(0, (-EXTENSION_LINE_HEIGHT / 2) * this.pixelRatio);
      lineShape.lineTo(
        (width / this.pixelsPerSecond) * this.pixelRatio,
        (-EXTENSION_LINE_HEIGHT / 2) * this.pixelRatio
      );
      lineShape.lineTo(
        (width / this.pixelsPerSecond) * this.pixelRatio,
        (EXTENSION_LINE_HEIGHT / 2) * this.pixelRatio
      );
      lineShape.lineTo(0, (EXTENSION_LINE_HEIGHT / 2) * this.pixelRatio);
      lineShape.lineTo(0, -(EXTENSION_LINE_HEIGHT / 2) * this.pixelRatio);
      let line;
      if (borderOnly) {
        const points = lineShape.getPoints();
        const geometry = new THREE.Geometry().setFromPoints(points);
        this.updateBolusExtensionDashedLineMaterial();
        geometry.computeLineDistances();
        line = new THREE.Line(geometry, this.bolusExtensionDashedLineMaterial);
      } else {
        const lineGeometry = new THREE.ShapeGeometry(lineShape);
        line = new THREE.Mesh(lineGeometry, this.bolusRectMaterial);
      }
      this.addAutoScrollableObjectToScene(this.scene, line, {
        x,
        y: centerY + 0.5,
        z,
        contentOffsetX: this.contentOffsetX,
        pixelsPerSecond: this.pixelsPerSecond,
        shouldScrollX: true,
        shouldScaleX: true,
        xFinalPixelAdjust,
      });
    }
  }

  renderBolusExtensionInterruptBar({ x, z, centerY }) {
    // Line
    const xFinalPixelAdjust = (this.bolusRect.width / 2) * this.pixelRatio;
    const lineShape = new THREE.Shape();
    lineShape.moveTo(0, (-EXTENSION_LINE_HEIGHT / 2) * this.pixelRatio);
    lineShape.lineTo(
      EXTENSION_INTERRUPT_BAR_WIDTH * this.pixelRatio,
      (-EXTENSION_LINE_HEIGHT / 2) * this.pixelRatio
    );
    lineShape.lineTo(
      EXTENSION_INTERRUPT_BAR_WIDTH * this.pixelRatio,
      (EXTENSION_LINE_HEIGHT / 2) * this.pixelRatio
    );
    lineShape.lineTo(0, (EXTENSION_LINE_HEIGHT / 2) * this.pixelRatio);
    lineShape.lineTo(0, -(EXTENSION_LINE_HEIGHT / 2) * this.pixelRatio);
    const lineGeometry = new THREE.ShapeGeometry(lineShape);
    const line = new THREE.Mesh(lineGeometry, this.bolusInterruptBarMaterial);

    this.addAutoScrollableObjectToScene(this.scene, line, {
      x,
      y: centerY + 0.5,
      z,
      contentOffsetX: this.contentOffsetX,
      pixelsPerSecond: this.pixelsPerSecond,
      shouldScrollX: true,
      shouldScaleX: false,
      xFinalPixelAdjust,
    });
  }

  renderBolusExtension({
    x,
    z,
    extended,
    duration,
    expectedExtended,
    expectedDuration,
  }) {
    const width = Math.floor(duration * this.pixelsPerSecond);
    let height = Math.ceil(extended * this.yAxisBolusPixelsPerValue);
    if (height < EXTENSION_LINE_HEIGHT / 2.0) {
      // tweak to align extension rect with bottom of bolus rect
      height = EXTENSION_LINE_HEIGHT / 2.0;
    }
    let originalWidth;
    if (expectedExtended !== undefined && expectedDuration !== undefined) {
      // extension was interrupted...
      if (expectedDuration > duration) {
        originalWidth = Math.floor(expectedDuration * this.pixelsPerSecond);
      } else {
        Logger.logWarning(
          `UNEXPECTED DATA - expectedDuration ${expectedDuration} not > duration ${duration}`
        );
      }
    }

    let yOrigin = this.yAxisBottomOfBolus - height;
    if (yOrigin === this.bolusRect.y - this.bolusRect.height) {
      yOrigin += EXTENSION_LINE_HEIGHT / 2.0;
    }
    const centerY = Math.round(yOrigin);

    // only draw original end shape if bolus was not interrupted!
    this.renderBolusExtensionShape({
      x,
      z,
      centerY,
      width,
      duration,
      borderOnly: false,
      noEndShape: originalWidth !== undefined,
    });

    // handle interrupted extended bolus
    if (originalWidth !== undefined) {
      // draw original extension, but make sure it is at least as large as the end shape!
      let extensionWidth = originalWidth - width;
      if (extensionWidth < EXTENSION_END_SHAPE_WIDTH) {
        extensionWidth = EXTENSION_END_SHAPE_WIDTH;
      }
      this.renderBolusExtensionShape({
        x: x + width / this.pixelsPerSecond,
        z,
        centerY,
        duration,
        width: extensionWidth,
        borderOnly: true,
      });

      // always draw an interrupt bar at the end of the delivered part of the extension
      this.renderBolusExtensionInterruptBar({
        x: x + width / this.pixelsPerSecond,
        z,
        centerY,
      });
    }
  }

  getWizardForBolusId(bolusId) {
    return this.wizardData.find(wizard => wizard.bolusId === bolusId);
  }

  /* eslint-disable class-methods-use-this */
  hasDataToRender({ bolusData, wizardData }) {
    const hasBolusData = bolusData && bolusData.length > 0;
    const hasWizardData = wizardData && wizardData.length > 0;
    // console.log(
    //   `hasBolusData: ${hasBolusData}, hasWizardData: ${hasWizardData}`
    // );
    return hasBolusData || hasWizardData;
  }
  /* eslint-enable class-methods-use-this */

  renderSelf({
    scene,
    graphScalableLayoutInfo,
    contentOffsetX,
    bolusData,
    maxBolusValue,
    minBolusScaleValue,
    wizardData,
  }) {
    // console.log(`GraphBolusGl renderSelf`);

    const {
      pixelsPerSecond,
      graphStartTimeSeconds,
      graphEndTimeSeconds,
    } = graphScalableLayoutInfo;

    const {
      yAxisBottomOfBolus,
      yAxisBolusHeight,
    } = graphScalableLayoutInfo.graphFixedLayoutInfo;

    this.scene = scene;
    this.contentOffsetX = contentOffsetX;
    this.pixelsPerSecond = pixelsPerSecond;
    this.bolusData = bolusData;
    this.wizardData = wizardData;
    this.maxBolusValue = maxBolusValue;
    this.yAxisBolusHeight = yAxisBolusHeight;
    this.yAxisBottomOfBolus = yAxisBottomOfBolus;

    if (this.isScrollOrZoomRender) {
      // During zoom, update dashed lines with new dashed line material with new pixelsPerSecond
      // (during zoom) so that the dashed lines appear the same width at all zoom levels.
      // FIXME: Ideally we should plumb support for detecting renders due to zoom or scroll
      // (distinguishing between them), rather than treating the same. We don't need to update the
      // materials of the lines during scroll, only during zoom!
      this.updateBolusExtensionDashedLineMaterial();

      // Return early since all our objects are auto-updated during zoom/scale, so, no need for any
      // further rendering (other than the update to the line dashed material above)
      return;
    }

    for (let i = 0; i < bolusData.length; i += 1) {
      const {
        id,
        time,
        value,
        extended,
        duration,
        expectedNormal,
        expectedExtended,
        expectedDuration,
      } = bolusData[i];

      if (time >= graphStartTimeSeconds && time <= graphEndTimeSeconds) {
        const timeOffset = time - graphStartTimeSeconds;

        // Constrain bolus value
        this.constrainedBolusValue = value;
        if (
          this.constrainedBolusValue > maxBolusValue &&
          this.constrainedBolusValue > minBolusScaleValue
        ) {
          // console.error("max bolus exceeded!");
          this.constrainedBolusValue = maxBolusValue;
        }

        // Set up x and z (constant for each mesh)
        const x = timeOffset;
        const z1 = this.zStart + (i + 1) * 0.01;
        const z2 = this.zStart + (i + 1) * 0.02;

        // Make bolus label text mesh
        const {
          textMesh,
          measuredWidth: bolusLabelWidth,
          capHeight,
        } = this.makeBolusLabelTextMesh({
          value,
        });
        const bolusLabelPadding = 0;
        const bolusLabelHeight = capHeight;

        this.yAxisBolusPixelsPerValue =
          (this.yAxisBolusHeight - bolusLabelHeight - 8) / this.maxBolusValue;

        // Render bolus rect
        this.renderBolusRect({
          x,
          z: z2,
        });

        let override = false;
        let interrupted = false;
        this.originalValue = 0;
        let wizardHasOriginal = false;
        // See if there is a corresponding wizard data point
        const wizard = this.getWizardForBolusId(id, { wizardData });
        if (wizard) {
          // console.log(
          //   `Found wizard with carb ${wizard.value} for bolus of value ${
          //     this.constrainedBolusValue
          //   }`
          // );
          const { recommendedNet } = wizard;
          if (recommendedNet && recommendedNet !== this.constrainedBolusValue) {
            override = true;
            this.originalValue = recommendedNet;
            wizardHasOriginal = true;
          }
        }

        // Handle interrupted boluses
        if (expectedNormal && expectedNormal > this.constrainedBolusValue) {
          interrupted = true;
          override = true;
          this.originalValue = expectedNormal;
          wizardHasOriginal = false;
        }

        // Handle extended and interrupted extended bolus portion
        if (extended) {
          let extendedOriginal = extended;
          if (expectedExtended && expectedExtended > extended) {
            interrupted = true;
            override = true;
            extendedOriginal = expectedExtended;
          }
          if (!wizardHasOriginal) {
            this.originalValue += extendedOriginal;
          }
        }

        // console.log(
        //   `override: ${override}, interrupted: ${interrupted}, originalValue: ${
        //     this.originalValue
        //   }. wizardHasOriginal: ${wizardHasOriginal}`
        // );

        // Draw override/interrupted rectangle and icon/bar if applicable
        if (override) {
          let bolusOverrideIconY =
            this.yAxisBottomOfBolus -
            this.yAxisBolusPixelsPerValue * this.originalValue;

          if (this.originalValue > this.constrainedBolusValue) {
            bolusOverrideIconY = this.bolusRect.y - this.bolusRect.height;
            this.renderBolusOverrideBar({
              z: z2,
            });
          }
          if (interrupted) {
            this.renderBolusInterruptBar({
              x,
              y: bolusOverrideIconY,
              z: z2,
            });
          } else {
            this.renderBolusOverrideIcon({
              x,
              y: bolusOverrideIconY,
              z: z2,
              isUp: this.originalValue < this.constrainedBolusValue,
            });
          }
        }

        // Render bolus rect background
        this.renderBolusRectBackground({
          x,
          z: z1,
        });

        // Render bolus label
        this.renderBolusLabel({
          x,
          z: z2,
          textMesh,
          bolusLabelWidth,
          bolusLabelHeight,
          bolusLabelPadding,
        });

        if (extended !== undefined && duration !== undefined) {
          this.renderBolusExtension({
            x,
            z: z2,
            extended,
            duration,
            expectedExtended,
            expectedDuration,
          });
        }

        this.allCompleteBolusRects.push(this.completeBolusRect);
        if (wizard) {
          wizard.bolusTopY =
            this.completeBolusRect.y - this.completeBolusRect.height;
        }
      }
    }

    // console.log(
    //   `completeBolusRects: ${JSON.stringify(
    //     this.allCompleteBolusRects,
    //     null,
    //     2
    //   )}`
    // );
  }
}

export default GraphBolusGl;
