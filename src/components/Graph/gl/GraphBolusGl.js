import { THREE } from "expo-three";

import GraphShapeGeometryFactory from "./GraphShapeGeometryFactory";
import GraphTextMeshFactory from "./GraphTextMeshFactory";
import GraphRenderLayerGl from "./GraphRenderLayerGl";
import { convertHexColorStringToInt } from "../helpers";

const BOLUS_RECT_WIDTH = 14;

// TODO: Refactor. This was a fairly straight port of the legacy iOS app. The render helpers and
// main renderSelf methods are kind of long and confusing. And the use of params vs. ivars in
// render helpers is confusing.

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

    this.bolusOverrideUpIconGeometry = this.makeBolusOverrideIconGeometry({
      isUp: true,
    });
    this.bolusOverrideDownIconGeometry = this.makeBolusOverrideIconGeometry({
      isUp: false,
    });
    this.bolusOverrideIconMaterial = new THREE.MeshBasicMaterial({
      color: convertHexColorStringToInt(this.theme.bolusOverrideIconColor),
    });
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

    // TODO: We should probably use the bold text like the legacy Tidepool Mobile iOS app. (Need a new bmfont for it.)
    return GraphTextMeshFactory.makeTextMesh({
      text: formattedValue,
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
    this.addAutoScrollableObjectToScene(this.scene, textMesh, {
      x,
      y,
      z,
      contentOffsetX: this.contentOffsetX,
      pixelsPerSecond: this.pixelsPerSecond,
      shouldScrollX: true,
      xFinalPixelAdjust: (-bolusLabelWidth * this.pixelRatio) / 2,
    });
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
    const rectangleEdgesGeometry = new THREE.EdgesGeometry(rectangleGeometry);
    const rectangleLines = new THREE.LineSegments(
      rectangleEdgesGeometry,
      this.overrideBarLineMaterial
    );
    rectangleLines.computeLineDistances();

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
    const height = this.yAxisBolusPixelsPerValue * this.constrainedBolusValue;
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

    if (this.isScrollOrZoomRender) {
      // No need to render for scroll or zoom since we're only using auto-scrollable objects
      return;
    }

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

    for (let i = 0; i < bolusData.length; i += 1) {
      const {
        id,
        time,
        value,
        extended,
        expectedNormal,
        expectedExtended,
        duration,
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
        const backgroundZ = this.zStart + i * 0.01;
        const foregroundZ = this.zStart + i * 0.01 + 0.001;

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
          z: foregroundZ,
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
              z: foregroundZ,
            });
          }
          if (interrupted) {
            this.renderBolusInterruptBar({
              x,
              y: bolusOverrideIconY,
              z: foregroundZ,
            });
          } else {
            this.renderBolusOverrideIcon({
              x,
              y: bolusOverrideIconY,
              z: foregroundZ,
              isUp: this.originalValue < this.constrainedBolusValue,
            });
          }
        }

        // Render bolus rect background
        this.renderBolusRectBackground({
          x,
          z: backgroundZ,
        });

        // Render bolus label
        this.renderBolusLabel({
          x,
          z: foregroundZ,
          textMesh,
          bolusLabelWidth,
          bolusLabelHeight,
          bolusLabelPadding,
        });

        if (extended !== undefined && duration !== undefined) {
          // TODO: render bolus extension
        }
      }
    }
  }
}

export default GraphBolusGl;
