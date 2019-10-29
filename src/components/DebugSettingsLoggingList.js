import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { StyleSheet } from "react-native";
import glamorous, { withTheme } from "glamorous-native";

import { ThemePropType } from "../prop-types/theme";
import Colors from "../constants/Colors";
import DebugSettingsLoggingListItemEnable from "./DebugSettingsLoggingListItemEnable";
import DebugSettingsLoggingListItemEmailLogs from "./DebugSettingsLoggingListItemEmailLogs";

const ITEM_ENABLE_HEALTH_LOGGING = "ITEM_ENABLE_HEALTH_LOGGING";
const ITEM_EMAIL_HEALTH_LOGS = "ITEM_EMAIL_HEALTH_LOGS";

class DebugSettingsLoggingList extends PureComponent {
  data = [ITEM_ENABLE_HEALTH_LOGGING, ITEM_EMAIL_HEALTH_LOGS];

  renderSeparator = () => (
    <glamorous.View
      height={StyleSheet.hairlineWidth}
      backgroundColor="#CED0CE"
    />
  );

  renderItem = ({ item }) => {
    const {
      navigateGoBack,
      // firstTimeTipsResetTips,
      // navigateDebugHealthScreen,
    } = this.props;

    switch (item) {
      case ITEM_ENABLE_HEALTH_LOGGING:
        return (
          <DebugSettingsLoggingListItemEnable
            key={item}
            navigateGoBack={navigateGoBack}
          />
        );
      case ITEM_EMAIL_HEALTH_LOGS:
        return (
          <DebugSettingsLoggingListItemEmailLogs
            key={item}
            navigateGoBack={navigateGoBack}
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
          {"Uploader Logging".toLocaleUpperCase()}
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

DebugSettingsLoggingList.propTypes = {
  theme: ThemePropType.isRequired,
  navigateGoBack: PropTypes.func.isRequired,
};

export default withTheme(DebugSettingsLoggingList);
