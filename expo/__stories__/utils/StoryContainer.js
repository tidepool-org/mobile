import React from "react";
import PropTypes from "prop-types";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { SafeAreaView, View } from "react-native";

import Fonts from "../../src/constants/Fonts";
import withThemeProvider from "../../src/enhancers/withThemeProvider";
import withExpoFontPreload from "../../src/enhancers/withExpoFontPreload";
import AppReducer from "../..//src/reducers";
import PrimaryTheme from "../../src/themes/PrimaryTheme";

const store = createStore(AppReducer);

const StoryContainerComponent = props => {
  const enhanced = withThemeProvider(
    withExpoFontPreload(() => props.children, Fonts),
    PrimaryTheme,
  );

  const shouldCenter = props.behaviors.includes("center");
  const shouldOutline = props.behaviors.includes("outline");

  const safeAreaViewStyle = { flex: 1 };
  const containerStyle = {};

  if (shouldCenter) {
    safeAreaViewStyle.justifyContent = "center";
    safeAreaViewStyle.alignItems = "center";
  }

  if (shouldOutline) {
    containerStyle.margin = 5;
    containerStyle.padding = 5;
    containerStyle.alignSelf = shouldCenter ? "center" : "flex-start";
    containerStyle.borderWidth = 1;
  }

  return (
    <Provider store={store}>
      <SafeAreaView style={safeAreaViewStyle}>
        <View style={containerStyle}>{enhanced()}</View>
      </SafeAreaView>
    </Provider>
  );
};

StoryContainerComponent.propTypes = {
  children: PropTypes.element.isRequired,
  behaviors: PropTypes.arrayOf(PropTypes.string.isRequired),
};

StoryContainerComponent.defaultProps = {
  behaviors: ["center", "outline"],
};

const StoryContainerScreen = props => {
  const enhanced = withThemeProvider(
    withExpoFontPreload(() => props.children, Fonts),
    PrimaryTheme,
  );
  return (
    <Provider store={store}>
      <SafeAreaView style={{ flex: 1 }}>{enhanced()}</SafeAreaView>
    </Provider>
  );
};

StoryContainerScreen.propTypes = {
  children: PropTypes.element.isRequired,
};

export { StoryContainerComponent, StoryContainerScreen };
