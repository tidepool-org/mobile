// NOTE: this file is copied via build script to App.js

import React, { PureComponent } from "react";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";

import withExpoFontPreload from "./src/enhancers/withExpoFontPreload";
import AppWithNavigationState from "./src/navigators/AppNavigator";
import Fonts from "./src/constants/Fonts";
import { environmentSetCurrentEnvironment } from "./src/actions/environment";
import { ENVIRONMENT_STAGING } from "./src/api";
import reducers from "./src/reducers";

class App extends PureComponent {
  constructor(props) {
    super(props);

    this.store = createStore(reducers, applyMiddleware(thunk));

    // TODO: api - this should default to what was last used, using AsyncStorage
    this.store.dispatch(environmentSetCurrentEnvironment(ENVIRONMENT_STAGING));
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
