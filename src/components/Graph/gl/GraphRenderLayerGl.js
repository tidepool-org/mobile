import { PixelRatio } from "react-native";

class GraphRenderLayerGl {
  constructor({ theme, graphFixedLayoutInfo, zStart = 900, zEnd = 999 }) {
    this.theme = theme;
    this.graphFixedLayoutInfo = graphFixedLayoutInfo;
    this.zStart = zStart;
    this.zEnd = zEnd;
    this.scrollableObjectsStartIndex = null;
    this.pixelRatio = PixelRatio.get();
    this.isInitialRender = true;
    this.isScrollOrZoomRender = false;
  }

  // NOTE: x is time offset from beginning of graph. The actual final x pixel value used in the
  // scene is based on pixelsPerSecond (horizontal scale) and pixelRatio of the device.
  // xFinalPixelAdjust is used as a final adjustment to the position. This can be used at insertion
  // time to enable center point anchor layout (e.g. centering a label at a given time in the
  // graph, e.g. for SMBG labels).
  // FIXME: This x (time-based) vs. xFinalPixelAdjust (pixel based) is confusing. Additionally,
  // elsewhere in graph layer render methods, we have places where we work in final pixel values
  // multiplying by pixelRatio (e.g. geometries), and other places where we work in 1.0 pixelRatio
  // units, and other places where we work in time-based units for x. This time vs pixel
  // disjunction is due to the horizontal time-based scaling support for x axis. We need to clean
  // all this up and simplify it and make it clear what units are being used in each place, etc, to
  // make it less confusing and less error prone
  addAutoScrollableObjectToScene(
    scene,
    object,
    {
      x,
      y,
      z,
      contentOffsetX,
      pixelsPerSecond,
      shouldScaleX = false,
      xFinalPixelAdjust = 0,
    }
  ) {
    const objectToTrack = object;

    // Remember the start index for scrollable objects
    // NOTE: All scrollabe objects need to be added contiguously in initial render pass
    if (this.scrollableObjectsStartIndex === null) {
      this.scrollableObjectsStartIndex = scene.children.length;
      this.scrollableObjectCount = 0;
    }

    // Set the initial position (and scale)
    objectToTrack.userData = {
      x,
      y,
      z,
      shouldScaleX,
      xFinalPixelAdjust,
    };
    this.updateScrollableObject(objectToTrack, {
      contentOffsetX,
      pixelsPerSecond,
    });

    // Add it to the scene and track it
    scene.add(objectToTrack);
    this.scrollableObjectCount += 1;
  }

  updateAutoScrollableObjectsInScene(
    scene,
    { contentOffsetX, pixelsPerSecond }
  ) {
    const objects = scene.children;
    const startIndex = this.scrollableObjectsStartIndex;
    const endIndex =
      this.scrollableObjectsStartIndex + this.scrollableObjectCount - 1;
    for (let i = startIndex; i <= endIndex; i += 1) {
      const object = objects[i];
      this.updateScrollableObject(object, {
        contentOffsetX,
        pixelsPerSecond,
      });
    }
  }

  updateScrollableObject(object, { contentOffsetX, pixelsPerSecond }) {
    if (object.userData.shouldScaleX) {
      object.scale.set(pixelsPerSecond, 1, 1);
    }
    this.updateObjectPosition(object, {
      x: object.userData.x * pixelsPerSecond - contentOffsetX,
      y: object.userData.y,
      z: object.userData.z,
      xFinalPixelAdjust: object.userData.xFinalPixelAdjust,
    });
  }

  updateObjectPosition(object, { x, y, z, xFinalPixelAdjust = 0 }) {
    // Adjust object position with pixelRatio, right hand coordinate system (-y), and increasing
    // z (for proper paint order of meshes)
    /* eslint-disable no-param-reassign */
    object.position.x = x * this.pixelRatio + xFinalPixelAdjust;
    object.position.y = -y * this.pixelRatio;
    object.position.z = z;
    /* eslint-enable no-param-reassign */
  }

  render({ scene, graphScalableLayoutInfo, contentOffsetX, ...rest }) {
    if (!this.hasDataToRender || this.hasDataToRender({ ...rest })) {
      if (!this.isInitialRender) {
        this.isScrollOrZoomRender = true;
      }

      if (this.isScrollOrZoomRender) {
        // Automatically update auto-scrollable objects in scene if rendering for scroll or zoom
        const { pixelsPerSecond } = graphScalableLayoutInfo;
        this.updateAutoScrollableObjectsInScene(scene, {
          contentOffsetX,
          pixelsPerSecond,
        });
      }

      if (this.renderSelf) {
        this.renderSelf({
          scene,
          graphScalableLayoutInfo,
          contentOffsetX,
          ...rest,
        });
      }

      this.isInitialRender = false;
    }
  }
}

export default GraphRenderLayerGl;
