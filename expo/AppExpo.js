// NOTE: this file is copied via build script to App.js

import React from "react";
import { Provider } from "react-redux";
import { createStore } from "redux";

import withExpoFontPreload from "./src/enhancers/withExpoFontPreload";
import AppWithNavigationState from "./src/navigators/AppNavigator";
import Fonts from "./src/constants/Fonts";
import AppReducer from "./src/reducers";

class App extends React.Component {
  store = createStore(AppReducer);

  render() {
    return (
      <Provider store={this.store}>
        <AppWithNavigationState />
      </Provider>
    );
  }
}

export default withExpoFontPreload(App, Fonts);
