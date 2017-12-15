import React from "react";
import { AppRegistry } from "react-native";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";

import AppWithNavigationState from "./src/navigators/AppNavigator";
import reducers from "./src/reducers";

class App extends React.Component {
  store = createStore(reducers, applyMiddleware(thunk));

  render() {
    return (
      <Provider store={this.store}>
        <AppWithNavigationState />
      </Provider>
    );
  }
}

AppRegistry.registerComponent("Tidepool", () => App);
