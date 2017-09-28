"use strict";

const OFF = 0;
const WARN = 1;
const ERROR = 2;

module.exports = {
  extends: ["airbnb", "prettier"],
  rules: {
    "react/jsx-filename-extension": [1, { extensions: [".js", ".jsx"] }],

    // Disable this rule for stories
    "import/no-extraneous-dependencies": [
      "error",
      { devDependencies: ["**/__stories__/*"] },
    ],

    // For React Native images
    "global-require": "off",

    // For React Native images
    "import/no-unresolved": "off",
  },
};
