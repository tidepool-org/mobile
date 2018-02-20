import React, { PureComponent } from "react";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import {
  createReduxBoundAddListener,
  createReactNavigationReduxMiddleware,
} from "react-navigation-redux-helpers";

import AppWithNavigationState from "./AppWithNavigationState";
import { appInitAsync } from "../actions/appInit";
import reducers from "../reducers";

// NOTE: Per React Navigation docs, createReactNavigationReduxMiddleware must be called before createReduxBoundAddListener
const reactNavigationMiddleware = createReactNavigationReduxMiddleware(
  "root",
  state => state.nav
);
const addListener = createReduxBoundAddListener("root");

class AppWithStore extends PureComponent {
  constructor(props) {
    super(props);

    this.store = createStore(
      reducers,
      applyMiddleware(thunk, reactNavigationMiddleware)
    );
    this.store.dispatch(appInitAsync());
  }

  render() {
    return (
      <Provider store={this.store}>
        <AppWithNavigationState addListener={addListener} />
      </Provider>
    );
  }
}

export default AppWithStore;
