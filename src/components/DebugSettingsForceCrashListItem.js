import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import glamorous, { withTheme } from "glamorous-native";
import { NativeModules } from "react-native";

import { ThemePropType } from "../prop-types/theme";

class DebugSettingsForceCrashListItem extends PureComponent {
  state = {
    isUnderlayVisible: false,
  };

  onPress = () => {
    const { navigateGoBack } = this.props;
    setTimeout(() => {
      navigateGoBack();
      try {
        const { TPNative } = NativeModules;
        TPNative.testNativeCrash();
      } catch (error) {
        // console.log(`error: ${error}`);
      }
    }, 50);
  };

  renderButtonText() {
    const { theme } = this.props;
    const { isUnderlayVisible } = this.state;
    const titleColor = isUnderlayVisible
      ? theme.titleColorActive
      : theme.listItemName.color;

    return (
      <glamorous.Text
        style={theme.listItemName}
        flex={1}
        allowFontScaling={false}
        numberOfLines={1}
        color={titleColor}
      >
        Force crash (test crash logs)
      </glamorous.Text>
    );
  }

  render() {
    const { theme } = this.props;

    return (
      <glamorous.TouchableHighlight
        onPress={this.onPress}
        underlayColor={theme.underlayColor}
        onShowUnderlay={() => {
          this.setState({ isUnderlayVisible: true });
        }}
        onHideUnderlay={() => {
          this.setState({ isUnderlayVisible: false });
        }}
      >
        <glamorous.View
          padding={8}
          paddingLeft={16}
          flexDirection="row"
          justifyContent="space-between"
        >
          {this.renderButtonText()}
        </glamorous.View>
      </glamorous.TouchableHighlight>
    );
  }
}

DebugSettingsForceCrashListItem.propTypes = {
  theme: ThemePropType.isRequired,
  navigateGoBack: PropTypes.func.isRequired,
};

export default withTheme(DebugSettingsForceCrashListItem);
