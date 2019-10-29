import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import glamorous, { withTheme } from "glamorous-native";

import { ThemePropType } from "../prop-types/theme";
import { TPNative } from "../models/TPNative";

class DebugSettingsLoggingListItemEmailLogs extends PureComponent {
  state = {
    isUnderlayVisible: false,
  };

  onPress = () => {
    const { navigateGoBack } = this.props;
    setTimeout(() => {
      navigateGoBack();
      TPNative.emailUploaderLogs();
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
        Email uploader logs
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

DebugSettingsLoggingListItemEmailLogs.propTypes = {
  theme: ThemePropType.isRequired,
  navigateGoBack: PropTypes.func.isRequired,
};

export default withTheme(DebugSettingsLoggingListItemEmailLogs);
