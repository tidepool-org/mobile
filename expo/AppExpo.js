// NOTE: this file is copied via build script to App.js

import withExpoFontPreload from "./src/enhancers/withExpoFontPreload";
import RootNavigator from "./src/navigators/RootNavigator";
import Fonts from "./src/constants/Fonts";

export default withExpoFontPreload(RootNavigator, Fonts);
