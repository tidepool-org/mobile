// This file is copied via pre script to index.js

import { registerRootComponent } from "expo";
import { activateKeepAwake } from "expo-keep-awake";
import { decode, encode } from "base-64";

import Fonts from "./src/constants/Fonts";
import withExpoFontPreload from "./src/enhancers/withExpoFontPreload";
import App from "./src/App";

// axios no longer polyfills btoa, so add that as a global for the app here
if (!global.btoa) {
  global.btoa = encode;
}

// axios no longer polyfills atob, so add that as a global for the app here
if (!global.atob) {
  global.atob = decode;
}

if (process.env.NODE_ENV === "development") {
  activateKeepAwake();
}

registerRootComponent(withExpoFontPreload(App, Fonts));