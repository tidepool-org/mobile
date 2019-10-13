import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { StyleSheet } from "react-native";
import glamorous, { withTheme } from "glamorous-native";

import { ThemePropType } from "../prop-types/theme";
import Colors from "../constants/Colors";
import { Logger } from "../models/Logger";
import DebugSettingsLoggingListItem from "./DebugSettingsLoggingListItem";

const logLevels = [
  {
    name: Logger.LOG_LEVEL_DEBUG,
    labelName: "Debug",
  },
  {
    name: Logger.LOG_LEVEL_INFO,
    labelName: "Info",
  },
  {
    name: Logger.LOG_LEVEL_WARNING,
    labelName: "Warning",
  },
  {
    name: Logger.LOG_LEVEL_ERROR,
    labelName: "Error (Default)",
  },
];

class DebugSettingsLoggingList extends PureComponent {
  onPress = graphRenderer => {
    const { onLogLevelSelected } = this.props;
    onLogLevelSelected(graphRenderer);
  };

  renderSeparator = () => (
    <glamorous.View
      height={StyleSheet.hairlineWidth}
      backgroundColor="#CED0CE"
    />
  );

  renderItem = ({ item }) => {
    const { selectedLogLevel } = this.props;
    return (
      <DebugSettingsLoggingListItem
        key={item.name}
        logLevel={item.name}
        logLevelLabelName={item.labelName}
        onPress={this.onPress}
        selected={item.name === selectedLogLevel}
      />
    );
  };

  render() {
    const { theme } = this.props;

    return (
      <glamorous.View>
        <glamorous.Text
          style={theme.debugSettingsSectionTitleStyle}
          marginTop={8}
          marginLeft={15}
          marginBottom={8}
        >
          {"Logging".toLocaleUpperCase()}
        </glamorous.Text>
        <glamorous.FlatList
          borderTopWidth={1}
          borderBottomWidth={1}
          borderColor={Colors.warmGrey}
          backgroundColor="white"
          scrollEnabled={false}
          data={logLevels}
          extraData={this.state}
          keyExtractor={item => item.name}
          renderItem={this.renderItem}
          ItemSeparatorComponent={this.renderSeparator}
        />
      </glamorous.View>
    );
  }
}

DebugSettingsLoggingList.propTypes = {
  theme: ThemePropType.isRequired,
  onLogLevelSelected: PropTypes.func.isRequired,
  selectedLogLevel: PropTypes.string,
};

DebugSettingsLoggingList.defaultProps = {
  selectedLogLevel: Logger.LOG_LEVEL_DEFAULT,
};

export default withTheme(DebugSettingsLoggingList);
