# Tidepool Mobile (React Native) Application

**VERY MUCH IN PROGRESS - PLEASE EXCUSE OUR MESS WHILE WE MAKE THIS BETTER**

## Table of Contents
- [Intro](#intro)
- [About Tidepool](#about-tidepool)
- [Overview](#overview)
- [Getting Started](#getting-started)
- [Development Process](#development-process)
    - [Feature Development](#feature-development)
    - [Bugs and Hotfixes](#bugs-and-hotfixes)
    - [Using Storybook](#using-storybook)
    - [Testing](#testing)
    - [Get in Touch with Us](#get-in-touch-with-us)
- [Available npm scripts](#available-npm-scripts)
  - [yarn run prestorybook](#yarn-run-prestorybook)
  - [yarn run pre](#yarn-run-pre)
  - [yarn run test](#yarn-run-test)
- [Next Planned Documentation](next-planned-documentation)
    - [Publishing and Building Standalone Apps](#publishing-and-building-standalone-apps-)


## Intro

Tidepool mobile is a react native application built to enable patients and their care team (family, clinicians) to visualize their diabetes device data (from insulin pumps, BGMs, and/or CGMs) and message each other. It is built on top of the [Tidepool](http://tidepool.org/) platform.

This README is focused on getting the Tidepool mobile app building and running locally to support both Tidepool and opensource developers being able to experiment with and contribute to this codebase.


## About Tidepool

Tidepool is a nonprofit organization whose mission is to make diabetes data more accessible, meaningful, and actionable for people with diabetes, their care teams, and researchers.

We believe that connected data leads to better decision-making. Tidepool is designed to help you discover insights and bring context to diabetes management. And, to help make diabetes data more actionable, we make it easy to share data with anyone you choose: caregivers, clinicians, endocrinologists, friends, researchers — anyone. With that in mind we are looking for ways to share the reality of diabetes with people beyond the diabetic community.


## Overview

This project was bootstrapped with Expo CLI [Expo CLI](https://docs.expo.io/versions/latest/workflow/expo-cli/).

The project currently supports building and running the iOS and Android apps within the Expo app or as a standalone installable iOS app (.ipa) or Android app (.apk). The app can be run in Expo using the normal Expo workflow. The standalone apps are built via Xcode (iOS) and Android Studio (Android).

*This documentation specifically outlines the expo workflow and does not currently go into development of the standalone apps*

The project uses [Storybook ](https://storybook.js.org/) for productive isolated dev/test of UI components used by the app.


## Getting Started

Before cloning this repo you will need to have the react native development environment setup on your computer. We recommend using the setup documentation on the react-native site found [here](https://facebook.github.io/react-native/docs/getting-started).

Clone this repo, then from inside the repo directory, execute `yarn install` to install npm dependencies followed by `yarn run pre` (a custom npm script defined below). Then start the Expo devtools and bundler by running `yarn start`. You should now be able to open the project in Expo and serve it locally in dev mode to the Expo app. See the [Expo documentation](http://expo.io) for more help if needed.


## Development Process

For feature development we use [git-flow](https://nvie.com/posts/a-successful-git-branching-model/). If you are not familiar with git-flow, please take a few minutes to read that document. This is not to be confused with GitHub flow which is significantly different. If you are interested in knowing more about the differences, check out [this article](https://githubflow.github.io) written by Github.


When developing a new feature using git-flow the process will look something like this: 
- branch off from the `develop` branch
- write, lint, and test feature
- submit a pull request
*pull request reviewed and approved*
- merge feature branch back to develop
- your feature will be included in the next release (which is published from the develop branch)

*in the case of an open source submitted pull request, Tidepool engineers will take care of everything after submission, but we have listed out the full process above for clarity*

**When you are ready to submit a pull request, please be sure to lint and test thoroughly before submitting.**


### Using Storybook

[storybook.js](https://storybook.js.org) is an open source tool for developing UI components in isolation. In short it allows you to look at an individual component in a story without having to render the entire application. For example, if you are working on a UI feature that only appears on a screen that you have to click through the application to get to, rather than having to navigate to that screen each time, you can write a story for the UI and do most of your work only refreshing the story enabling you to work much faster. 

Refer to existing stories to see the software pattern we use for creating stories and be sure to run `yarn run prestorybook` after creating a new story, otherwise the application doesn't know to look for it and you won't be able to see it rendered. 

To switch back-and-forth between Storybook and non-storybook while developing a feature, we have built scripts to swap the entry point quickly by executing `yarn run prestorybook` (to switch to Storybook) or `yarn run pre` (to switch to non-Storybook). This just switches the entry point for the app and should auto-reload (via Live Reload) in each connected Expo app.


### Testing

Linting locally: `npx eslint src/ --max-warnings 0`

Testing with specified timezones (and updating storybook stories and storyshots): 
`TZ=America/Chicago yarn run prestorybook`
`TZ=America/Chicago yarn test`
`TZ=America/Chicago yarn test -u`
`TZ=America/Chicago yarn test --forceExit --silent` 

There is specific logic around running the tests with the Chicago timezone distinction, but for the moment I'm not going to break it down here, just please trust me in that this will make it easiest for us to review and merge feature branches.


### Get in Touch with Us

Questions or comments? Just want to say hi? Join our open slack community [tidepoolorg.slack.com](http://public-chat.tidepool.org/) or drop us a note at [info@tidepool.org](mailto:info@tidepool.org) and we'll make sure to put you in touch with the right person.


## Available npm scripts

#### `yarn run pre`

This must be used once after a fresh clone of the repository or when switching from Storybook to non-Storybook. This script copies the main entry point (crna-entry.js) to index.js.

#### `yarn run prestorybook`

Copies the Storybook entry point (storybook-entry.js) to index.js and updates the Storybook loader.

#### `yarn run test`

Runs the [jest](https://github.com/facebook/jest) test runner. This includes some unit tests as well as jest snapshot tests of components.


## Next Planned Documentation

- Publishing and Building Standalone Apps