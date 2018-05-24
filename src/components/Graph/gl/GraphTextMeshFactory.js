// Use require instead of import (for three-bmfont-text) and set global THREE due to: https://github.com/Jam3/three-bmfont-text/issues/13
const THREE = require("three");
const { PixelRatio } = require("react-native");
const ExpoTHREE = require("expo-three");
const createGeometry = require("three-bmfont-text");

const { createTextureAsync } = ExpoTHREE;

// Creating bmfont json and sprite sheet
// Create .fnt and .png from .ttf
// http://www.angelcode.com/products/bmfont/
// or https://github.com/libgdx/libgdx/wiki/Hiero (used this)
//
// Convert from .fnt to .json
// https://www.npmjs.com/package/convert-bmfont
// TODO: Look at using MSDF for better rendering

// FIXME: Due to some odd issue with asset bundling on Android, it seems that if we have the
// sprite sheet texture bundled (as opposed to served from CDN, when publishing via Expo) it fails
// to load, or isn't seen as a valid texture. Other image assets (not used as textures) don't seem
// to have this problem. This is only an issue for Android, not iOS. For now we exclude the bmfont
// assets from bundling (see assetBundlePatterns in app.json) and just serve from CDN. We should
// revisit this, though, and try to root cause / fix, or confirm whether a future ExpoKit release
// (or other dependencies like expo-three, etc), have fixed.

class GraphTextMeshFactory {
  constructor() {
    this.geometryPool = new Map();
    this.materialPool = new Map();
    this.pixelRatioBase = 3.0; // The sprite sheet targets a 3.0 base pixel ratio
    this.pixelRatio = PixelRatio.get();
    this.pixelRatioScale = this.pixelRatio / this.pixelRatioBase;
    this.textHeightScale = 0.75; // Adjust scale to get desired pixel height
  }

  makeTextMesh({ text, width, color }) {
    const geometry = this.getGeometry({ text, width });
    const material = this.getMaterial({ color });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.applyMatrix(
      new THREE.Matrix4().makeScale(
        1 * this.textHeightScale * this.pixelRatioScale,
        -1 * this.textHeightScale * this.pixelRatioScale,
        -1
      )
    );
    return mesh;
  }

  async loadAssets() {
    if (!this.assetsAreLoaded) {
      this.bmFont = require("../../../../assets/bmfonts/OpenSans-Regular-56px.json");
      this.bmFontSpriteSheetTexture = await createTextureAsync({
        asset: require("../../../../assets/bmfonts/OpenSans-Regular-56px.png"),
      });
    }
    this.assetsAreLoaded = true;
  }

  getGeometry({ text, width }) {
    let geometry = this.geometryPool.get(text);
    if (!geometry) {
      geometry = createGeometry({
        text,
        font: this.bmFont,
        width: width * this.pixelRatioBase / this.textHeightScale,
        align: "center",
      });
      this.geometryPool.set(text, geometry);
    }
    return geometry;
  }

  getMaterial({ color }) {
    let material = this.materialPool.get(color);
    if (!material) {
      material = new THREE.MeshBasicMaterial({
        map: this.bmFontSpriteSheetTexture,
        color,
        transparent: true,
      });
      this.materialPool.set(color, material);
    }
    return material;
  }
}

export default new GraphTextMeshFactory();
