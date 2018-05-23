/* eslint-disable no-undef */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */

import React from "react";
import renderer from "react-test-renderer";

import App from "../src/App";

// Stub console.error and console.warn to workaround useless(?) react-test-renderer console.error
// FIXME: See https://github.com/facebook/react/issues/11098
console.error = error => {
  throw new Error(error);
};
console.warn = warning => {
  throw new Error(warning);
};

it("renders without crashing", () => {
  const rendered = renderer.create(<App />).toJSON();
  expect(rendered).toBeTruthy();
});
