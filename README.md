Tidepool is a mobile app (iOS and Android) for type 1 diabetes (T1D) built on top of the [Tidepool](http://tidepool.org/) platform. It allows patients and their "care team" (family, doctors) to visualize their diabetes device data (from insulin pumps, BGMs, and/or CGMs) and message each other.

This README is focused on just the details of getting the Tidepool mobile app building and running locally.

---

## Table of Contents

- [Overview](#overview)
- [Getting Started](#getting-started)
- [Publishing and Building Standalone Apps](#publishing-and-building-standalone-apps-)
- [npm scripts](#npm-scripts)
  - [yarn run prestorybook](#yarn-run-prestorybook)
  - [yarn run pre](#yarn-run-pre)
  - [yarn run test](#yarn-run-test)

## Overview

This project was bootstrapped with Expo CLI [Expo CLI](https://docs.expo.io/versions/latest/workflow/expo-cli/).

The project currently supports building and running the iOS and Android apps within the Expo app or as a standalone installable iOS app (.ipa) or Android app (.apk). The app can be run in Expo using the normal Expo workflow. The standalone apps are built via Xcode (iOS) and Android Studio (Android).

The project uses [Storybook ](https://storybook.js.org/) for productive isolated dev/test of UI components used by the app.

## Getting Started

After cloning, execute `yarn install` to install npm dependencies followed by `yarn run pre`. Then start the Expo devtools and bundler via `expo start`. You should now be able to open the project in Expo and serve it locally in dev mode to the Expo app.

To switch back-and-forth between Storybook and non-storybook, just execute `yarn run prestorybook` (to switch to Storybook) or `yarn run pre` (to switch to non-Storybook). This just switches the entry point for the app and should auto-reload (via Live Reload) in each connected Expo app.

## Publishing and Building Standalone Apps

TODO

## npm scripts

### `yarn run pre`

This must be used once after a fresh clone of the repository or when switching from Storybook to non-Storybook. This script copies the main entry point (crna-entry.js) to index.js.

### `yarn run prestorybook`

Copies the Storybook entry point (storybook-entry.js) to index.js and updates the Storybook loader.

### `yarn run test`

Runs the [jest](https://github.com/facebook/jest) test runner. This includes some unit tests as well as jest snapshot tests of components.
