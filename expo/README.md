This project was bootstrapped with [Create React Native App](https://github.com/react-community/create-react-native-app). The most recent version the guide is available [here](https://github.com/react-community/create-react-native-app/blob/master/react-native-scripts/template/README.md).

## Table of Contents

* [Available Scripts](#available-scripts)
  * [yarn start](#npm-start)
  * [yarn test](#npm-test)
  * [yarn run ios](#npm-run-ios)
  * [yarn run android](#npm-run-android)

## Available Scripts

### `yarn run pre`

This must be used once before trying to run the packager, or when switching from storybook. This copies the Expo variant of some files like App.js and environment.js into place. When running storybook, the storybook variants of these files will be copied into place. The ejected version of the app also has a pre comment which serves a similar purpose.

### `yarn run storybook`

Start the storybook server with the storybook npm script. Now, you can open http://localhost:7007 to view your storybook menus in the browser.

### `yarn start`

Runs your app in development mode.

Open it in the [Expo app](https://expo.io) on your phone to view it. It will reload if you save edits to your files, and you will see build errors and logs in the terminal.

Sometimes you may need to reset or clear the React Native packager's cache. To do so, you can pass the `--reset-cache` flag to the start script:

```
yarn start -- --reset-cache
```

### `yarn test`

Runs the [jest](https://github.com/facebook/jest) test runner on your tests.

### `yarn run ios`

Like `yarn start`, but also attempts to open your app in the iOS Simulator if you're on a Mac and have it installed.

### `yarn run android`

Like `yarn start`, but also attempts to open your app on a connected Android device or emulator. Requires an installation of Android build tools (see [React Native docs](https://facebook.github.io/react-native/docs/getting-started.html) for detailed setup). 