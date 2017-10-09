import React from "react";

import withThemeProvider from "./enhancers/withThemeProvider";
import PrimaryTheme from "./themes/PrimaryTheme";
import SignInScreen from "./screens/SignInScreen";

const App = () => <SignInScreen />;

export default withThemeProvider(App, PrimaryTheme);
