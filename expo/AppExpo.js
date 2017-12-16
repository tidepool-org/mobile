// NOTE: this file is copied via build script to App.js

import React, { PureComponent } from "react";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";

import withExpoFontPreload from "./src/enhancers/withExpoFontPreload";
import AppWithNavigationState from "./src/navigators/AppNavigator";
import Fonts from "./src/constants/Fonts";
import reducers from "./src/reducers";

class App extends PureComponent {
  store = createStore(reducers, applyMiddleware(thunk));

  render() {
    return (
      <Provider store={this.store}>
        <AppWithNavigationState />
      </Provider>
    );
  }
}

export default withExpoFontPreload(App, Fonts);
