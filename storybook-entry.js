// This file is copied via prestorybook script to index.js

import Expo from "expo";

import Fonts from "./src/constants/Fonts";
import withExpoFontPreload from "./src/enhancers/withExpoFontPreload";
import App from "./storybook";
import GraphTextMeshFactory from "./src/components/Graph/gl/GraphTextMeshFactory";
import GraphCbgGl from "./src/components/Graph/gl/GraphCbgGl";
import GraphSmbgGl from "./src/components/Graph/gl/GraphSmbgGl";

if (process.env.NODE_ENV === "development") {
  Expo.KeepAwake.activate();
}

const loadAssetsAsync = async () => {
  await GraphTextMeshFactory.loadAssetsAsync();
  await GraphCbgGl.loadAssetsAsync();
  await GraphSmbgGl.loadAssetsAsync();
};

loadAssetsAsync();

Expo.registerRootComponent(withExpoFontPreload(App, Fonts));
