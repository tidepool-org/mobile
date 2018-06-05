import { PixelRatio } from "react-native";
import { THREE } from "expo-three";

class GraphShapeGeometryFactory {
  constructor() {
    this.geometryPool = new Map();
  }

  makeRectangleGeometry({ width, height }) {
    const key = `${width}-${height}`;
    let geometry = this.geometryPool.get(key);
    if (!geometry) {
      const pixelRatio = PixelRatio.get();
      const shape = new THREE.Shape();
      shape.moveTo((-width / 2) * pixelRatio, (-height / 2) * pixelRatio);
      shape.lineTo((width / 2) * pixelRatio, (-height / 2) * pixelRatio);
      shape.lineTo((width / 2) * pixelRatio, (height / 2) * pixelRatio);
      shape.lineTo((-width / 2) * pixelRatio, (height / 2) * pixelRatio);
      shape.moveTo((-width / 2) * pixelRatio, (-height / 2) * pixelRatio);
      geometry = new THREE.ShapeGeometry(shape);
      this.geometryPool.set(key, geometry);
    }

    return geometry;
  }
}

export default new GraphShapeGeometryFactory();
