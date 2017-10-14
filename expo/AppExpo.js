// NOTE: this file is copied via build script to App.js

import withExpoFontPreload from "./src/enhancers/withExpoFontPreload";
import App from "./src/App";
import PrimaryTheme from "./src/themes/PrimaryTheme";

export default withExpoFontPreload(App, PrimaryTheme.fonts);
