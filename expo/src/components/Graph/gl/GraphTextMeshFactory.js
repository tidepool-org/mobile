import createGeometry from "three-bmfont-text";
import { PixelRatio } from "react-native";

import { THREE, createTextureAsync } from "./helpers";

// Create .fnt from .ttf
// http://www.angelcode.com/products/bmfont/
// or https://github.com/libgdx/libgdx/wiki/Hiero
//
// Convert from .fnt to .json
// https://www.npmjs.com/package/convert-bmfont
// TODO: Look at using MSDF for better rendering

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
      this.bmFont = require("./fonts/OpenSans-Regular-56px.json");
      console.log("before create texture");
      this.bmFontSpriteSheetTexture = await createTextureAsync({
        asset: require("./fonts/OpenSans-Regular-56px.png"),
      });
      console.log("after create texture");
    }
    this.assetsAreLoaded = true;
  }

  getGeometry({ text, width }) {
    let geometry = this.geometryPool.get(text);
    if (!geometry) {
      geometry = createGeometry({
        text,
        font: require("./fonts/OpenSans-Regular-56px.json"),
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
