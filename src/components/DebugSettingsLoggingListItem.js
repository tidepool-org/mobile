import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import glamorous, { withTheme } from "glamorous-native";

import { ThemePropType } from "../prop-types/theme";

class DebugSettingsLoggingListItem extends PureComponent {
  state = {
    isUnderlayVisible: false,
  };

  onPress = () => {
    const { logLevel, onPress } = this.props;
    onPress(logLevel);
  };

  renderName() {
    const { theme, logLevelLabelName } = this.props;
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
        {logLevelLabelName}
      </glamorous.Text>
    );
  }

  renderSelectedCheckMark() {
    const { theme, selected } = this.props;
    const { isUnderlayVisible } = this.state;
    const borderColor = isUnderlayVisible
      ? theme.titleColorActive
      : theme.underlayColor;

    if (selected) {
      return (
        <glamorous.View
          width={13}
          height={6}
          marginLeft={12}
          alignSelf="center"
          backgroundColor="transparent"
          borderBottomWidth={2}
          borderLeftWidth={2}
          borderColor={borderColor}
          transform={[
            {
              rotate: "-45deg",
            },
          ]}
        />
      );
    }

    return null;
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
          {this.renderSelectedCheckMark()}
        </glamorous.View>
      </glamorous.TouchableHighlight>
    );
  }
}

DebugSettingsLoggingListItem.propTypes = {
  theme: ThemePropType.isRequired,
  logLevel: PropTypes.string.isRequired,
  logLevelLabelName: PropTypes.string.isRequired,
  selected: PropTypes.bool,
  onPress: PropTypes.func.isRequired,
};

DebugSettingsLoggingListItem.defaultProps = {
  selected: false,
};

export default withTheme(DebugSettingsLoggingListItem);
