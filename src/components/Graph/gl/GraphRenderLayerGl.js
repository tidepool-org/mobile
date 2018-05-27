import { PixelRatio } from "react-native";

class GraphRenderLayerGl {
  constructor({
    theme,
    graphFixedLayoutInfo,
    graphStartTimeSeconds,
    zStart = 900,
    zEnd = 999,
  }) {
    this.theme = theme;
    this.graphFixedLayoutInfo = graphFixedLayoutInfo;
    this.graphStartTimeSeconds = graphStartTimeSeconds;
    this.zStart = zStart;
    this.zEnd = zEnd;

    this.pixelRatio = PixelRatio.get();
  }

  updateObjectPosition(object, { x, y, z }) {
    // Adjust object position with pixelRatio, right hand coordinate system (-y), and increasing
    // z (for proper paint order of meshes)
    /* eslint-disable no-param-reassign */
    object.position.x = x * this.pixelRatio;
    object.position.y = -y * this.pixelRatio;
    object.position.z = z;
    /* eslint-enable no-param-reassign */
  }
}

export default GraphRenderLayerGl;
