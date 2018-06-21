import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import glamorous, { withTheme } from "glamorous-native";

import { ThemePropType } from "../prop-types/theme";

class DebugSettingsResetFirstTimeSettingsListItem extends PureComponent {
  state = {
    isUnderlayVisible: false,
  };

  onPress = () => {
    const { firstTimeTipsResetTips, navigateGoBack } = this.props;
    navigateGoBack();
    setTimeout(() => {
      firstTimeTipsResetTips();
    }, 50);
  };

  renderButtonText() {
    const { theme } = this.props;
    const titleColor = this.state.isUnderlayVisible
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
        Reset First-time Tips
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

DebugSettingsResetFirstTimeSettingsListItem.propTypes = {
  theme: ThemePropType.isRequired,
  navigateGoBack: PropTypes.func.isRequired,
  firstTimeTipsResetTips: PropTypes.func.isRequired,
};

export default withTheme(DebugSettingsResetFirstTimeSettingsListItem);
