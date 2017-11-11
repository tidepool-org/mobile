// NOTE: this file is copied via build script to App.js

import withExpoFontPreload from "./src/enhancers/withExpoFontPreload";
import RootNavigator from "./src/navigators/RootNavigator";
import PrimaryTheme from "./src/themes/PrimaryTheme";

export default withExpoFontPreload(RootNavigator, PrimaryTheme.fonts);
