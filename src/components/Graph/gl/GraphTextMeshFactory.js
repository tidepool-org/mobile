import ExpoTHREE, { THREE } from "expo-three";

const { PixelRatio } = require("react-native");
const createGeometry = require("three-bmfont-text");

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
    this.bmFonts = new Map();
    this.bmFontSpriteSheetTextures = new Map();
    this.pixelRatioBase = 3.0; // The sprite sheet targets a 3.0 base pixel ratio
    this.pixelRatio = PixelRatio.get();
    this.pixelRatioScale = this.pixelRatio / this.pixelRatioBase;
    this.textHeightScale = 0.75; // Adjust scale to get desired pixel height
  }

  makeTextMesh({ text, fontName, width, color, align = "center" }) {
    const {
      geometry,
      measuredWidth,
      measuredHeight,
      capHeight,
    } = this.getGeometry({
      text,
      fontName,
      width,
      align,
    });
    const material = this.getMaterial({ fontName, color });
    const textMesh = new THREE.Mesh(geometry, material);
    textMesh.applyMatrix(
      new THREE.Matrix4().makeScale(
        1 * this.textHeightScale * this.pixelRatioScale,
        -1 * this.textHeightScale * this.pixelRatioScale,
        -1
      )
    );
    return { textMesh, measuredWidth, measuredHeight, capHeight };
  }

  async loadAssetsAsync() {
    if (!this.assetsAreLoaded) {
      let font = require("../../../../assets/bmfonts/OpenSans-Regular-56px.json");
      let spriteSheetTexture = await ExpoTHREE.loadAsync(
        require("../../../../assets/bmfonts/OpenSans-Regular-56px.png")
      );
      this.bmFonts.set("OpenSans-Regular-56px", font);
      this.bmFontSpriteSheetTextures.set(
        "OpenSans-Regular-56px",
        spriteSheetTexture
      );
      font = require("../../../../assets/bmfonts/OpenSans-Semibold-56px.json");
      spriteSheetTexture = await ExpoTHREE.loadAsync(
        require("../../../../assets/bmfonts/OpenSans-Semibold-56px.png")
      );
      this.bmFonts.set("OpenSans-Semibold-56px", font);
      this.bmFontSpriteSheetTextures.set(
        "OpenSans-Semibold-56px",
        spriteSheetTexture
      );
    }
    this.assetsAreLoaded = true;
  }

  getGeometry({ text, fontName, width, align }) {
    const key = `${text}-${fontName}-${width}-${align}`;
    let geometry = this.geometryPool.get(key);
    if (!geometry) {
      geometry = createGeometry(THREE, {
        text,
        font: this.bmFonts.get(fontName),
        width: width
          ? width / this.textHeightScale / this.pixelRatioScale
          : undefined,
        // width: width
        //   ? (width * this.pixelRatioBase) / this.textHeightScale
        //   : undefined,
        align,
      });
      this.geometryPool.set(key, geometry);
    }

    const measuredWidth =
      (geometry.layout.width * this.textHeightScale) / this.pixelRatioBase;
    const measuredHeight =
      (geometry.layout.height * this.textHeightScale) / this.pixelRatioBase;
    const capHeight =
      (geometry.layout.capHeight * this.textHeightScale) / this.pixelRatioBase;
    return { geometry, measuredWidth, measuredHeight, capHeight };
  }

  getMaterial({ fontName, color }) {
    const key = `${fontName}-${color}`;
    let material = this.materialPool.get(key);
    if (!material) {
      material = new THREE.MeshBasicMaterial({
        map: this.bmFontSpriteSheetTextures.get(fontName),
        color,
        transparent: true,
      });
      this.materialPool.set(key, material);
    }
    return material;
  }
}

export default new GraphTextMeshFactory();
