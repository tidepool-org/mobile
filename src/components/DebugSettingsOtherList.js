import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { StyleSheet } from "react-native";
import glamorous, { withTheme } from "glamorous-native";

import { ThemePropType } from "../prop-types/theme";
import Colors from "../constants/Colors";
import DebugSettingsResetFirstTimeSettingsListItem from "./DebugSettingsResetFirstTimeSettingsListItem";

const ITEM_RESET_FIRST_TIME_TIPS = "Reset ITEM_RESET_FIRST_TIME_TIPS";

class DebugSettingsOtherList extends PureComponent {
  data = [ITEM_RESET_FIRST_TIME_TIPS];

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
