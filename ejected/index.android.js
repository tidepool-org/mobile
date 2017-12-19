import React, { PureComponent } from "react";
import { AppRegistry } from "react-native";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";

import AppWithNavigationState from "./src/navigators/AppNavigator";
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

AppRegistry.registerComponent("Tidepool", () => App);
