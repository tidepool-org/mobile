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

class StoryContainerComponent extends PureComponent {
  render() {
    const { children, behaviors } = this.props;

    const paddingTop = Platform.OS === "android" ? StatusBar.currentHeight : 0;

    const enhanced = withThemeProvider(
      withExpoFontPreload(() => children, Fonts),
      PrimaryTheme
    );

    const shouldCenter = behaviors.includes("center");
    const shouldOutline = behaviors.includes("outline");

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
        <SafeAreaView style={safeAreaViewStyle} paddingTop={paddingTop}>
          <View style={containerStyle}>{enhanced()}</View>
        </SafeAreaView>
      </Provider>
    );
  }
}

StoryContainerComponent.propTypes = {
  children: PropTypes.element.isRequired,
  behaviors: PropTypes.arrayOf(PropTypes.string.isRequired),
};

StoryContainerComponent.defaultProps = {
  behaviors: ["center", "outline"],
};

export default StoryContainerComponent;
