// This file is copied via pre script to index.js

import { registerRootComponent } from "expo";
import { activateKeepAwake } from "expo-keep-awake";

import Fonts from "./src/constants/Fonts";
import withExpoFontPreload from "./src/enhancers/withExpoFontPreload";
import App from "./src/App";

if (process.env.NODE_ENV === "development") {
  activateKeepAwake();
}

registerRootComponent(withExpoFontPreload(App, Fonts));
