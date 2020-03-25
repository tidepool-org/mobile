import React, { PureComponent } from "react";
import glamorous, { withTheme } from "glamorous-native";

import { ThemePropType } from "../prop-types/theme";
import { TPNative } from "../models/TPNative";

class DebugSettingsLoggingListItemEnable extends PureComponent {
  state = {
    isUnderlayVisible: false,
  };

  onPress = () => {
    TPNative.enableUploaderLogging(!TPNative.isUploaderLoggingEnabled());
  };

  renderName() {
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
        {TPNative.isUploaderLoggingEnabled()
          ? "Disable uploader logging"
          : "Enable uploader logging"}
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
          {this.renderName()}
        </glamorous.View>
      </glamorous.TouchableHighlight>
    );
  }
}

DebugSettingsLoggingListItemEnable.propTypes = {
  theme: ThemePropType.isRequired,
};

export default withTheme(DebugSettingsLoggingListItemEnable);
