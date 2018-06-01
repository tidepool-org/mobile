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
    this.zStart = zStart;
    this.zEnd = zEnd;
    this.scrollableObjectsStartIndex = undefined;
    this.pixelRatio = PixelRatio.get();
    this.isInitialRender = true;
    this.isScrollOrZoomRender = false;
  }

  addAutoScrollableObjectToScene(
    scene,
    object,
    { x, y, z, contentOffsetX, pixelsPerSecond, shouldScaleX = false }
  ) {
    const objectToTrack = object;

    // Remember the start index for scrollable objects
    // NOTE: All scrollabe objects need to be added contiguously in initial render pass
    if (this.scrollableObjectsStartIndex === undefined) {
      this.scrollableObjectsStartIndex = scene.children.length;
      this.scrollableObjectCount = 0;
    }

    // Set the initial position (and scale)
    objectToTrack.userData = {
      x,
      y,
      z,
      shouldScaleX,
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
    });
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

  render({ scene, graphScalableLayoutInfo, contentOffsetX, ...rest }) {
    if (!this.hasDataToRender || this.hasDataToRender({ ...rest })) {
      if (!this.isInitialRender) {
        this.isScrollOrZoomRender = true;
      }

      if (this.renderSelf) {
        this.renderSelf({
          scene,
          graphScalableLayoutInfo,
          contentOffsetX,
          ...rest,
        });
      }

      if (this.isScrollOrZoomRender) {
        // Automatically update auto-scrollable objects in scene if rendering for scroll or zoom
        const { pixelsPerSecond } = graphScalableLayoutInfo;
        this.updateAutoScrollableObjectsInScene(scene, {
          contentOffsetX,
          pixelsPerSecond,
        });
      }

      this.isInitialRender = false;
    }
  }
}

export default GraphRenderLayerGl;
