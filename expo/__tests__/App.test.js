import React from "react";
import { createStore } from "redux";
import { Provider } from "react-redux";
import renderer from "react-test-renderer";

import AppWithNavigationState from "../src/navigators/AppNavigator";
import AppReducer from "../src/reducers";

it("renders without crashing", () => {
  const store = createStore(AppReducer);

  const rendered = renderer
    .create(
      <Provider store={store}>
        <AppWithNavigationState />
      </Provider>,
    )
    .toJSON();
  expect(rendered).toBeTruthy();
});
