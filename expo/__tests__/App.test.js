import React from "react";
import RootNavigator from "../src/navigators/RootNavigator";

import renderer from "react-test-renderer";

it("renders without crashing", () => {
  const rendered = renderer.create(<RootNavigator />).toJSON();
  expect(rendered).toBeTruthy();
});
