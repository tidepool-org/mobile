"use strict";

const OFF = 0;
const WARN = 1;
const ERROR = 2;

module.exports = {
  extends: ["airbnb", "prettier"],
  parser: "babel-eslint",
  rules: {
    "react/jsx-filename-extension": [1, { extensions: [".js", ".jsx"] }],
    "react/no-did-mount-set-state": OFF,
    "react/prefer-stateless-function": OFF,

    "comma-dangle": ["error", "always-multiline"],

    // Disable for now, latest version of eslint-plugin-react is confused. Revisit this.
    "react/no-typos": OFF,

    // Disable this rule for stories
    "import/no-extraneous-dependencies": [
      "error",
      { devDependencies: ["**/__stories__/*"] }
    ],

    // For React Native images
    "global-require": OFF,

    // For React Native images
    "import/no-unresolved": OFF
  },
  settings: {
    "import/resolver": "reactnative"
  }
};
