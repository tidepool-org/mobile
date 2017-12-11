import React from "react";
import { AppRegistry } from "react-native";
import { Provider } from "react-redux";
import { createStore } from "redux";

import AppWithNavigationState from "./src/navigators/AppNavigator";
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

AppRegistry.registerComponent("Tidepool", () => App);
