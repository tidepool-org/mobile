// NOTE: This file is copied via build script to App.js

import React, { PureComponent } from "react";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";

import withExpoFontPreload from "./src/enhancers/withExpoFontPreload";
import Fonts from "./src/constants/Fonts";
import AppWithNavigationState from "./src/navigators/AppNavigator";
import { appInitAsync } from "./src/actions/appInit";
import reducers from "./src/reducers";

class App extends PureComponent {
  constructor(props) {
    super(props);

    this.store = createStore(reducers, applyMiddleware(thunk));
    this.store.dispatch(appInitAsync());
  }

  render() {
    return (
      <Provider store={this.store}>
        <AppWithNavigationState />
      </Provider>
    );
  }
}

export default withExpoFontPreload(App, Fonts);
