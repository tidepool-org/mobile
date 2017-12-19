import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { StyleSheet } from "react-native";
import glamorous, { withTheme } from "glamorous-native";

import ThemePropTypes from "../themes/ThemePropTypes";
import Colors from "../constants/Colors";
import DebugSettingsEnvironmentListItem from "./DebugSettingsEnvironmentListItem";
import {
  ENVIRONMENT_PRODUCTION,
  ENVIRONMENT_INTEGRATION,
  ENVIRONMENT_STAGING,
  ENVIRONMENT_DEVELOPMENT,
} from "../api";

const environments = [
  { name: ENVIRONMENT_DEVELOPMENT },
  { name: ENVIRONMENT_STAGING },
  { name: ENVIRONMENT_INTEGRATION },
  { name: ENVIRONMENT_PRODUCTION },
];

class DebugSettingsEnvironmentList extends PureComponent {
  onPress = environmentName => {
    this.props.environmentSignOutAndSetCurrentEnvironmentAsync(environmentName);
  };

  renderSeparator = () => (
    <glamorous.View
      height={StyleSheet.hairlineWidth}
      backgroundColor="#CED0CE"
    />
  );

  renderItem = ({ item }) => (
    <DebugSettingsEnvironmentListItem
      key={item.name}
      environmentName={item.name}
      onPress={this.onPress}
      selected={item.name === this.props.selectedEnvironment}
    />
  );

  render() {
    const { theme } = this.props;

    return (
      <glamorous.View>
        <glamorous.Text
          style={theme.debugSettingsSectionTitleStyle}
          marginTop={15}
          marginLeft={15}
          marginBottom={8}
        >
          {"Tidepool Environment".toLocaleUpperCase()}
        </glamorous.Text>
        <glamorous.FlatList
          borderTopWidth={1}
          borderBottomWidth={1}
          borderColor={Colors.warmGrey}
          backgroundColor="white"
          scrollEnabled={false}
          data={environments}
          extraData={this.state}
          keyExtractor={item => item.name}
          renderItem={this.renderItem}
          ItemSeparatorComponent={this.renderSeparator}
        />
      </glamorous.View>
    );
  }
}

DebugSettingsEnvironmentList.propTypes = {
  theme: ThemePropTypes.isRequired,
  environmentSignOutAndSetCurrentEnvironmentAsync: PropTypes.func.isRequired,
  selectedEnvironment: PropTypes.string,
};

DebugSettingsEnvironmentList.defaultProps = {
  selectedEnvironment: "",
};

export default withTheme(DebugSettingsEnvironmentList);
