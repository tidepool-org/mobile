// This file is copied via pre script to index.js

import Expo from "expo";

import Fonts from "./src/constants/Fonts";
import withExpoFontPreload from "./src/enhancers/withExpoFontPreload";
import App from "./src/App";

if (process.env.NODE_ENV === "development") {
  Expo.KeepAwake.activate();
}

Expo.registerRootComponent(withExpoFontPreload(App, Fonts));
