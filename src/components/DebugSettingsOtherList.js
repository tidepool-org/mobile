import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { StyleSheet } from "react-native";
import glamorous, { withTheme } from "glamorous-native";

import { ThemePropType } from "../prop-types/theme";
import Colors from "../constants/Colors";
import DebugSettingsResetFirstTimeSettingsListItem from "./DebugSettingsResetFirstTimeSettingsListItem";
import DebugSettingsForceCrashListItem from "./DebugSettingsForceCrashListItem";
import DebugSettingsForceLogListItem from "./DebugSettingsForceLogListItem";
import Logger from "../models/Logger";

const ITEM_RESET_FIRST_TIME_TIPS = "ITEM_RESET_FIRST_TIME_TIPS";
const ITEM_FORCE_CRASH = "ITEM_FORCE_CRASH";
const ITEM_FORCE_LOG_WARNING = "ITEM_FORCE_LOG_WARNING";
const ITEM_FORCE_LOG_ERROR = "ITEM_FORCE_LOG_ERROR";

class DebugSettingsOtherList extends PureComponent {
  data = [
    ITEM_RESET_FIRST_TIME_TIPS,
    ITEM_FORCE_CRASH,
    ITEM_FORCE_LOG_WARNING,
    ITEM_FORCE_LOG_ERROR,
  ];

  renderSeparator = () => (
    <glamorous.View
      height={StyleSheet.hairlineWidth}
      backgroundColor="#CED0CE"
    />
  );

  renderItem = ({ item }) => {
    const { navigateGoBack, firstTimeTipsResetTips } = this.props;

    switch (item) {
      case ITEM_RESET_FIRST_TIME_TIPS:
        return (
          <DebugSettingsResetFirstTimeSettingsListItem
            key={item}
            navigateGoBack={navigateGoBack}
            firstTimeTipsResetTips={firstTimeTipsResetTips}
          />
        );
      case ITEM_FORCE_CRASH:
        return (
          <DebugSettingsForceCrashListItem
            key={item}
            navigateGoBack={navigateGoBack}
          />
        );
      case ITEM_FORCE_LOG_WARNING:
        return (
          <DebugSettingsForceLogListItem
            key={item}
            navigateGoBack={navigateGoBack}
            logLevel={Logger.LOG_LEVEL_WARNING}
          />
        );
      case ITEM_FORCE_LOG_ERROR:
        return (
          <DebugSettingsForceLogListItem
            key={item}
            navigateGoBack={navigateGoBack}
            logLevel={Logger.LOG_LEVEL_ERROR}
          />
        );
      default:
        return null;
    }
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
          {"Other".toLocaleUpperCase()}
        </glamorous.Text>
        <glamorous.FlatList
          borderTopWidth={1}
          borderBottomWidth={1}
          borderColor={Colors.warmGrey}
          backgroundColor="white"
          scrollEnabled={false}
          data={this.data}
          extraData={this.state}
          keyExtractor={item => item}
          renderItem={this.renderItem}
          ItemSeparatorComponent={this.renderSeparator}
        />
      </glamorous.View>
    );
  }
}

DebugSettingsOtherList.propTypes = {
  theme: ThemePropType.isRequired,
  navigateGoBack: PropTypes.func.isRequired,
  firstTimeTipsResetTips: PropTypes.func.isRequired,
};

export default withTheme(DebugSettingsOtherList);
