import ExpoTHREE, { THREE } from "expo-three";

import GraphRenderLayerGl from "./GraphRenderLayerGl";
import GraphShapeGeometryFactory from "./GraphShapeGeometryFactory";
import GraphTextMeshFactory from "./GraphTextMeshFactory";
import { MAX_BG_VALUE, convertHexColorStringToInt } from "../helpers";

const { createTextureAsync } = ExpoTHREE;

// Support rendering using circle geometry or sprites
const useSprites = false;

class GraphSmbgGl extends GraphRenderLayerGl {
  constructor(props) {
    // console.log(`GraphSmbgGl ctor`);

    super(props);

    const radius = 9;
    if (useSprites) {
      this.lowSpriteMaterial = new THREE.MeshBasicMaterial({
        map: GraphSmbgGl.lowSpriteTexture,
        transparent: true,
      });
      this.normalSpriteMaterial = new THREE.MeshBasicMaterial({
        map: GraphSmbgGl.normalSpriteTexture,
        transparent: true,
      });
      this.highSpriteMaterial = new THREE.MeshBasicMaterial({
        map: GraphSmbgGl.highSpriteTexture,
        transparent: true,
      });
      this.spriteGeometry = new THREE.PlaneGeometry(
        radius * 2 * this.pixelRatio,
        radius * 2 * this.pixelRatio,
        1,
        1
      );
    } else {
      this.lowMaterial = new THREE.MeshBasicMaterial({
        color: convertHexColorStringToInt(this.theme.graphBgLowColor),
      });
      this.normalMaterial = new THREE.MeshBasicMaterial({
        color: convertHexColorStringToInt(this.theme.graphBgNormalColor),
      });
      this.highMaterial = new THREE.MeshBasicMaterial({
        color: convertHexColorStringToInt(this.theme.graphBgHighColor),
      });
      this.circleOutlineGeometry = new THREE.CircleBufferGeometry(
        radius * this.pixelRatio,
        8 * this.pixelRatio
      );
      this.circleGeometry = new THREE.CircleBufferGeometry(
        (radius - 1) * this.pixelRatio,
        8 * this.pixelRatio
      );
    }

    this.backgroundMaterial = new THREE.MeshBasicMaterial({
      color: convertHexColorStringToInt(this.theme.graphBackgroundColor),
    });
  }

  static async loadAssetsAsync() {
    if (GraphSmbgGl.assetsAreLoaded) {
      return;
    }

    if (useSprites) {
      GraphSmbgGl.lowSpriteTexture = await createTextureAsync({
        asset: require("../../../../assets/images/smbg-circle-low.png"),
      });
      GraphSmbgGl.lowSpriteTexture.magFilter = THREE.NearestFilter;
      GraphSmbgGl.lowSpriteTexture.minFilter = THREE.NearestFilter;
      GraphSmbgGl.normalSpriteTexture = await createTextureAsync({
        asset: require("../../../../assets/images/smbg-circle-normal.png"),
      });
      GraphSmbgGl.normalSpriteTexture.magFilter = THREE.NearestFilter;
      GraphSmbgGl.normalSpriteTexture.minFilter = THREE.NearestFilter;
      GraphSmbgGl.highSpriteTexture = await createTextureAsync({
        asset: require("../../../../assets/images/smbg-circle-high.png"),
      });
      GraphSmbgGl.highSpriteTexture.magFilter = THREE.NearestFilter;
      GraphSmbgGl.highSpriteTexture.minFilter = THREE.NearestFilter;
    }

    GraphSmbgGl.assetsAreLoaded = true;
  }

  /* eslint-disable class-methods-use-this */
  hasDataToRender({ smbgData }) {
    return smbgData && smbgData.length > 0;
  }
  /* eslint-enable class-methods-use-this */

  renderSelfUsingCircleGeometry({
    scene,
    contentOffsetX,
    pixelsPerSecond,
    x,
    y,
    z,
    isLow,
    isHigh,
  }) {
    let material = this.normalMaterial;
    if (isLow) {
      material = this.lowMaterial;
    } else if (isHigh) {
      material = this.highMaterial;
    }
    let object = new THREE.Mesh(
      this.circleOutlineGeometry,
      this.backgroundMaterial
    );
    this.addAutoScrollableObjectToScene(scene, object, {
      x,
      y,
      z,
      contentOffsetX,
      pixelsPerSecond,
      shouldScrollX: true,
    });
    object = new THREE.Mesh(this.circleGeometry, material);
    this.addAutoScrollableObjectToScene(scene, object, {
      x,
      y,
      z,
      contentOffsetX,
      pixelsPerSecond,
      shouldScrollX: true,
    });
  }

  renderSelfUsingSprites({
    scene,
    contentOffsetX,
    pixelsPerSecond,
    x,
    y,
    z,
    isLow,
    isHigh,
  }) {
    let material = this.normalSpriteMaterial;
    if (isLow) {
      material = this.lowSpriteMaterial;
    } else if (isHigh) {
      material = this.highSpriteMaterial;
    }
    const object = new THREE.Mesh(this.spriteGeometry, material);
    this.addAutoScrollableObjectToScene(scene, object, {
      x,
      y,
      z,
      contentOffsetX,
      pixelsPerSecond,
      shouldScrollX: true,
    });
  }

  renderSelf({ scene, graphScalableLayoutInfo, contentOffsetX, smbgData }) {
    // console.log(`GraphSmbgGl renderSelf`);

    if (this.isScrollOrZoomRender) {
      // No need to render for scroll or zoom since we're only using auto-scrollable objects
      return;
    }

    const {
      pixelsPerSecond,
      graphStartTimeSeconds,
      graphEndTimeSeconds,
    } = graphScalableLayoutInfo;
    for (let i = 0; i < smbgData.length; i += 1) {
      const { time, value, isLow, isHigh } = smbgData[i];
      if (time >= graphStartTimeSeconds && time <= graphEndTimeSeconds) {
        // Add circle
        const constrainedValue = Math.min(value, MAX_BG_VALUE);
        const timeOffset = time - graphStartTimeSeconds;
        const x = timeOffset;
        const y =
          this.graphFixedLayoutInfo.yAxisBottomOfGlucose -
          constrainedValue *
            this.graphFixedLayoutInfo.yAxisGlucosePixelsPerValue;
        let color = this.theme.graphBgNormalColor;
        if (isLow) {
          color = this.theme.graphBgLowColor;
        } else if (isHigh) {
          color = this.theme.graphBgHighColor;
        }

        const z = this.zStart + (i * 3 + 0) * 0.01;
        if (useSprites) {
          this.renderSelfUsingSprites({
            scene,
            contentOffsetX,
            pixelsPerSecond,
            x,
            y,
            z,
            isLow,
            isHigh,
          });
        } else {
          this.renderSelfUsingCircleGeometry({
            scene,
            contentOffsetX,
            pixelsPerSecond,
            x,
            y,
            z,
            isLow,
            isHigh,
          });
        }

        // Make text mesh
        const text = value.toString();
        const {
          textMesh,
          measuredWidth,
          capHeight,
        } = GraphTextMeshFactory.makeTextMesh({
          text,
          color,
        });

        // Add text background
        const textTopToCircleBottom = 12;
        const textPadding = 4;
        const textBackgroundGeometry = GraphShapeGeometryFactory.makeRectangleGeometry(
          {
            width: measuredWidth + textPadding,
            height: capHeight + textPadding,
          }
        );
        const object = new THREE.Mesh(
          textBackgroundGeometry,
          this.backgroundMaterial
        );
        this.addAutoScrollableObjectToScene(scene, object, {
          x,
          y: y + capHeight / 2 + textTopToCircleBottom,
          z: this.zStart + (i * 3 + 1) * 0.01,
          contentOffsetX,
          pixelsPerSecond,
          shouldScrollX: true,
        });

        // Add text
        this.addAutoScrollableObjectToScene(scene, textMesh, {
          x,
          y: y + capHeight + textTopToCircleBottom,
          z: this.zStart + (i * 3 + 2) * 0.01,
          contentOffsetX,
          pixelsPerSecond,
          shouldScrollX: true,
          xFinalPixelAdjust: (-measuredWidth * this.pixelRatio) / 2,
        });
      }
    }
  }
}

export default GraphSmbgGl;
