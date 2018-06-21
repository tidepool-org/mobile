import ExpoTHREE, { THREE } from "expo-three";

import GraphRenderLayerGl from "./GraphRenderLayerGl";
import { MAX_BG_VALUE, convertHexColorStringToInt } from "../helpers";

const { createTextureAsync } = ExpoTHREE;

// Support rendering using circle geometry or sprites
const useSprites = false;

class GraphCbgGl extends GraphRenderLayerGl {
  constructor(props) {
    // console.log(`GraphCbgGl ctor`);

    super(props);

    const radius = 3.5;
    if (useSprites) {
      this.lowSpriteMaterial = new THREE.MeshBasicMaterial({
        map: GraphCbgGl.lowSpriteTexture,
        transparent: true,
      });
      this.normalSpriteMaterial = new THREE.MeshBasicMaterial({
        map: GraphCbgGl.normalSpriteTexture,
        transparent: true,
      });
      this.highSpriteMaterial = new THREE.MeshBasicMaterial({
        map: GraphCbgGl.highSpriteTexture,
        transparent: true,
      });
      this.spriteGeometry = new THREE.PlaneGeometry(
        radius * 2 * this.pixelRatio,
        radius * 2 * this.pixelRatio,
        1,
        1
      );
    } else {
      this.circleGeometry = new THREE.CircleBufferGeometry(
        radius * this.pixelRatio,
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
  }

  static async loadAssetsAsync() {
    if (GraphCbgGl.assetsAreLoaded) {
      return;
    }

    if (useSprites) {
      GraphCbgGl.lowSpriteTexture = await createTextureAsync({
        asset: require("../../../../assets/images/cbg-circle-low.png"),
      });
      GraphCbgGl.lowSpriteTexture.magFilter = THREE.NearestFilter;
      GraphCbgGl.lowSpriteTexture.minFilter = THREE.NearestFilter;
      GraphCbgGl.normalSpriteTexture = await createTextureAsync({
        asset: require("../../../../assets/images/cbg-circle-normal.png"),
      });
      GraphCbgGl.normalSpriteTexture.magFilter = THREE.NearestFilter;
      GraphCbgGl.normalSpriteTexture.minFilter = THREE.NearestFilter;
      GraphCbgGl.highSpriteTexture = await createTextureAsync({
        asset: require("../../../../assets/images/cbg-circle-high.png"),
      });
      GraphCbgGl.highSpriteTexture.magFilter = THREE.NearestFilter;
      GraphCbgGl.highSpriteTexture.minFilter = THREE.NearestFilter;
    }

    GraphCbgGl.assetsAreLoaded = true;
  }

  /* eslint-disable class-methods-use-this */
  hasDataToRender({ cbgData }) {
    return cbgData && cbgData.length > 0;
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
    const object = new THREE.Mesh(this.circleGeometry, material);
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

  renderSelf({ scene, graphScalableLayoutInfo, contentOffsetX, cbgData }) {
    // console.log(`GraphCbgGl renderSelf`);

    if (this.isScrollOrZoomRender) {
      // No need to render for scroll or zoom since we're only using auto-scrollable objects
      return;
    }

    const {
      pixelsPerSecond,
      graphStartTimeSeconds,
      graphEndTimeSeconds,
    } = graphScalableLayoutInfo;
    for (let i = 0; i < cbgData.length; i += 1) {
      const { time, value, isLow, isHigh } = cbgData[i];
      if (time >= graphStartTimeSeconds && time <= graphEndTimeSeconds) {
        const constrainedValue = Math.min(value, MAX_BG_VALUE);
        const timeOffset = time - graphStartTimeSeconds;
        const x = timeOffset;
        const y =
          this.graphFixedLayoutInfo.yAxisBottomOfGlucose -
          constrainedValue *
            this.graphFixedLayoutInfo.yAxisGlucosePixelsPerValue;
        const z = this.zStart + i * 0.01;

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
      }
    }
  }
}

export default GraphCbgGl;
