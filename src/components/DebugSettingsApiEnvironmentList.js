import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { StyleSheet } from "react-native";
import glamorous, { withTheme } from "glamorous-native";

import { ThemePropType } from "../prop-types/theme";
import Colors from "../constants/Colors";
import DebugSettingsApiEnvironmentListItem from "./DebugSettingsApiEnvironmentListItem";
import {
  API_ENVIRONMENT_PRODUCTION,
  API_ENVIRONMENT_STAGING,
  API_ENVIRONMENT_DEVELOPMENT,
} from "../api";

const apiEnvironments = [
  { name: API_ENVIRONMENT_DEVELOPMENT },
  { name: API_ENVIRONMENT_STAGING },
  { name: API_ENVIRONMENT_PRODUCTION },
];

class DebugSettingsApiEnvironmentList extends PureComponent {
  onPress = apiEnvironmentName => {
    const { onApiEnvironmentSelected } = this.props;
    onApiEnvironmentSelected(apiEnvironmentName);
  };

  renderSeparator = () => (
    <glamorous.View
      height={StyleSheet.hairlineWidth}
      backgroundColor="#CED0CE"
    />
  );

  renderItem = ({ item }) => {
    const { selectedApiEnvironment } = this.props;
    return (
      <DebugSettingsApiEnvironmentListItem
        key={item.name}
        apiEnvironmentName={item.name}
        onPress={this.onPress}
        selected={item.name === selectedApiEnvironment}
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
          {"Tidepool Environment".toLocaleUpperCase()}
        </glamorous.Text>
        <glamorous.FlatList
          borderTopWidth={1}
          borderBottomWidth={1}
          borderColor={Colors.warmGrey}
          backgroundColor="white"
          scrollEnabled={false}
          data={apiEnvironments}
          extraData={this.state}
          keyExtractor={item => item.name}
          renderItem={this.renderItem}
          ItemSeparatorComponent={this.renderSeparator}
        />
      </glamorous.View>
    );
  }
}

DebugSettingsApiEnvironmentList.propTypes = {
  theme: ThemePropType.isRequired,
  onApiEnvironmentSelected: PropTypes.func.isRequired,
  selectedApiEnvironment: PropTypes.string,
};

DebugSettingsApiEnvironmentList.defaultProps = {
  selectedApiEnvironment: "",
};

export default withTheme(DebugSettingsApiEnvironmentList);
