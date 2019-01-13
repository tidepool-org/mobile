// This file is copied via pre script to index.js

import { KeepAwake, registerRootComponent } from "expo";

import Fonts from "./src/constants/Fonts";
import withExpoFontPreload from "./src/enhancers/withExpoFontPreload";
import App from "./src/App";

if (process.env.NODE_ENV === "development") {
  KeepAwake.activate();
}

registerRootComponent(withExpoFontPreload(App, Fonts));
