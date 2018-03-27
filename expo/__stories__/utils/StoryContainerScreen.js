import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import { SafeAreaView, Platform, StatusBar, View } from "react-native";

import Fonts from "../../src/constants/Fonts";
import withThemeProvider from "../../src/enhancers/withThemeProvider";
import withExpoFontPreload from "../../src/enhancers/withExpoFontPreload";
import reducers from "../../src/reducers";
import PrimaryTheme from "../../src/themes/PrimaryTheme";

// TODO: storybook - should probably use mock or faker-based actions and reducers for storybook??
const store = createStore(reducers, applyMiddleware(thunk));

class StoryContainerScreen extends PureComponent {
  render() {
    const { children } = this.props;

    const paddingTop = Platform.OS === "android" ? StatusBar.currentHeight : 0;

    const enhanced = withThemeProvider(
      withExpoFontPreload(() => children, Fonts),
      PrimaryTheme
    );
    return (
      <Provider store={store}>
        <SafeAreaView style={{ flex: 1, paddingTop }}>
          {enhanced()}
        </SafeAreaView>
      </Provider>
    );
  }
}

StoryContainerScreen.propTypes = {
  children: PropTypes.element.isRequired,
};

export default StoryContainerScreen;
