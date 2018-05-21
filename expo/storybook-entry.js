import Expo from "expo";

import Fonts from "./src/constants/Fonts";
import withExpoFontPreload from "./src/enhancers/withExpoFontPreload";
import App from "./storybook";
import GraphTextMeshFactory from "./src/components/Graph/gl/GraphTextMeshFactory";

if (process.env.NODE_ENV === "development") {
  Expo.KeepAwake.activate();
}

const loadAssets = async () => {
  await GraphTextMeshFactory.loadAssets();
};

loadAssets();

Expo.registerRootComponent(withExpoFontPreload(App, Fonts));
