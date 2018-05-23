import React, { PureComponent } from "react";
import { createStore, applyMiddleware, compose } from "redux";
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

    /* eslint-disable no-undef, no-underscore-dangle */
    const composeEnhancers =
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    this.store = createStore(
      reducers,
      composeEnhancers(applyMiddleware(thunk, reactNavigationMiddleware))
    );
    /* eslint-enable no-undef, no-underscore-dangle */
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
