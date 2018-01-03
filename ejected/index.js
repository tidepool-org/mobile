import React, { PureComponent } from "react";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import { AppRegistry } from "react-native";

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

AppRegistry.registerComponent("Tidepool", () => App);
