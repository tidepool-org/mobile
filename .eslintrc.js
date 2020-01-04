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
    "react/forbid-prop-types": OFF,
    "lines-between-class-members": [
      "error",
      "always",
      { exceptAfterSingleLine: true },
    ],
    "no-else-return": ["error", { allowElseIf: true }],
    "import/prefer-default-export": OFF,
    "comma-dangle": [
      "error",
      {
        arrays: "always-multiline",
        objects: "always-multiline",
        imports: "always-multiline",
        exports: "always-multiline",
        functions: "ignore",
      },
    ],

    // Allow UNSAFE_ (e.g. for deprecated React lifecycle methods) not being camel case
    camelcase: [
      "error",
      {
        ignoreDestructuring: true,
        allow: ["^UNSAFE_"],
      },
    ],

    // Disable for now, latest version of eslint-plugin-react is confused. Revisit this.
    "react/no-typos": OFF,
    "react/destructuring-assignment": OFF,

    // Disable this rule for stories
    "import/no-extraneous-dependencies": [
      "error",
      { devDependencies: ["**/__stories__/*"] },
    ],

    // Disable this rule until best rule for @expo/vector-icons
    "import/no-extraneous-dependencies": OFF,

    // For React Native images
    "global-require": OFF,

    // For React Native images
    "import/no-unresolved": OFF,
  },
  settings: {
    "import/resolver": "reactnative",
  },
};
