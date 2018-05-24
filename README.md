Tidepool is a mobile app (iOS and Android) for type 1 diabetes (T1D) built on top of the [Tidepool](http://tidepool.org/) platform. It allows patients and their "care team" (family, doctors) to visualize their diabetes device data (from insulin pumps, BGMs, and/or CGMs) and message each other.

This README is focused on just the details of getting the Tidepool mobile app building and running locally.

---

## Table of Contents

* [Overview](#overview)
* [Getting Started](#getting-started)
* [Publishing and Building Standalone Apps](#publishing-and-building-standalone-apps-)
* [npm scripts](#npm-scripts)
  * [yarn run storybook](#yarn-run-storybook)
  * [yarn run prestorybook](#yarn-run-prestorybook)
  * [yarn run pre](#yarn-run-pre)
  * [yarn run test](#yarn-run-test)

## Overview

This project was bootstrapped with [Create React Native App](https://github.com/react-community/create-react-native-app) (CRNA). The most recent version the guide is available [here](https://github.com/react-community/create-react-native-app/blob/master/react-native-scripts/template/README.md).

The project currently supports building and running the iOS and Android apps within the [Expo app](https://expo.io) or as a standalone installable iOS app (.ipa) or Android app (.apk). The Expo app is built via [XDE](https://expo.io/tools#xde). The standalone apps are built via Xcode (iOS) and Android Studio (Android).

The project uses [Storybook for React Native](https://github.com/storybooks/storybook/tree/master/app/react-native) for productive isolated dev/test of UI components used by the app.

## Getting Started

After cloning, execute `yarn install` to install npm dependencies followed by `yarn run pre` to copy the main entry point (crna-entry.js) to index.js.

You should now be able to open the project in XDE and serve it locally in dev mode to the Expo app. Suggest using LAN mode as the host in XDE, which will play nicely when switching between Storybook and non-Storybook.

To run Storybook, use `yarn run storybook`. This will copy the Storybook entry point (storybook-entry.js) to index.js and will execute rnstl, which will update the Storybook loader for the stories in **stories** (using react-native-storybook-loader), and will will then start the Storybook server. You can then open the Storybook browser (http://localhost:7007) to navigate stories, which will load the story in each connected Expo app.

To switch back-and-forth between Storybook and non-storybook, just execute `yarn run prestorybook` (to switch to Storybook) or `yarn run pre` (to switch to non-Storybook). This just switches the entry point for the app and should auto-reload (via Live Reload) in each connected Expo app.

## Publishing and Building Standalone Apps

TODO

## npm scripts

### `yarn run pre`

This must be used once after a fresh clone of the repository or when switching from Storybook to non-Storybook. This script copies the main entry point (crna-entry.js) to index.js.

### `yarn run storybook`

Starts the storybook server

### `yarn run prestorybook`

Copies the Storybook entry point (storybook-entry.js) to index.js and updates the Storybook loader.

### `yarn run test`

Runs the [jest](https://github.com/facebook/jest) test runner. This includes some unit tests as well as jest snapshot tests of components.
