import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { StyleSheet } from "react-native";
import glamorous, { withTheme } from "glamorous-native";

import { ThemePropType } from "../prop-types/theme";
import Colors from "../constants/Colors";
import DebugSettingsCacheExpirationListItem from "./DebugSettingsCacheExpirationListItem";
import {
  API_CACHE_EXPIRATION_0_SECONDS,
  API_CACHE_EXPIRATION_1_MINUTE,
  API_CACHE_EXPIRATION_5_MINUTES,
  API_CACHE_EXPIRATION_180_DAYS,
} from "../api/TidepoolApiCacheControl";
import { api } from "../api";
import { formatBytes } from "../utils/formatBytes";

const items = [
  { name: API_CACHE_EXPIRATION_0_SECONDS },
  { name: API_CACHE_EXPIRATION_1_MINUTE },
  { name: API_CACHE_EXPIRATION_5_MINUTES },
  { name: API_CACHE_EXPIRATION_180_DAYS },
];

class DebugSettingsCacheExpirationList extends PureComponent {
  state = {
    cacheSize: 0,
  };

  async componentDidMount() {
    const cacheSize = await api().cache.calculateEstimatedSizeInBytes();

    this.setState({
      cacheSize,
    });
  }

  onPress = name => {
    const { onCacheExpirationSelected } = this.props;
    onCacheExpirationSelected(name);
  };

  renderSeparator = () => (
    <glamorous.View
      height={StyleSheet.hairlineWidth}
      backgroundColor="#CED0CE"
    />
  );

  renderItem = ({ item }) => {
    const { selectedApiCacheExpiration } = this.props;
    return (
      <DebugSettingsCacheExpirationListItem
        key={item.name}
        name={item.name}
        onPress={this.onPress}
        selected={item.name === selectedApiCacheExpiration}
      />
    );
  };

  render() {
    const { theme } = this.props;
    const { cacheSize } = this.state;

    return (
      <glamorous.View>
        <glamorous.Text
          style={theme.debugSettingsSectionTitleStyle}
          marginTop={8}
          marginLeft={15}
          marginBottom={8}
        >
          {`${"Offline Cache".toLocaleUpperCase()} (${formatBytes(cacheSize)})`}
        </glamorous.Text>
        <glamorous.FlatList
          borderTopWidth={1}
          borderBottomWidth={1}
          borderColor={Colors.warmGrey}
          backgroundColor="white"
          scrollEnabled={false}
          data={items}
          extraData={this.state}
          keyExtractor={item => item.name}
          renderItem={this.renderItem}
          ItemSeparatorComponent={this.renderSeparator}
        />
      </glamorous.View>
    );
  }
}

DebugSettingsCacheExpirationList.propTypes = {
  theme: ThemePropType.isRequired,
  onCacheExpirationSelected: PropTypes.func.isRequired,
  selectedApiCacheExpiration: PropTypes.string,
};

DebugSettingsCacheExpirationList.defaultProps = {
  selectedApiCacheExpiration: "",
};

export default withTheme(DebugSettingsCacheExpirationList);
