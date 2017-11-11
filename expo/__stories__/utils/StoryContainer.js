import React from "react";
import PropTypes from "prop-types";
import { View } from "react-native";

import withThemeProvider from "../../src/enhancers/withThemeProvider";
import withExpoFontPreload from "../../src/enhancers/withExpoFontPreload";
import PrimaryTheme from "../../src/themes/PrimaryTheme";

const navigation = {
  navigate: () => {},
  dispatch: () => {},
  goBack: () => {},
};

const StoryContainerComponent = props => {
  const enhanced = withThemeProvider(
    withExpoFontPreload(
      () => React.cloneElement(props.children, { navigation, ...props }),
      PrimaryTheme.fonts,
    ),
    PrimaryTheme,
  );
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {enhanced()}
    </View>
  );
};

StoryContainerComponent.propTypes = {
  children: PropTypes.element.isRequired,
};

const StoryContainerScreen = props => {
  const enhanced = withThemeProvider(
    withExpoFontPreload(
      () => React.cloneElement(props.children, { navigation, ...props }),
      PrimaryTheme.fonts,
    ),
    PrimaryTheme,
  );
  return (
    <View
      style={{
        flex: 1,
      }}
    >
      {enhanced()}
    </View>
  );
};

StoryContainerScreen.propTypes = {
  children: PropTypes.element.isRequired,
};

export { StoryContainerComponent, StoryContainerScreen };
