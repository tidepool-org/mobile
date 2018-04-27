import React, { PureComponent } from "react";
import { Platform, StyleSheet } from "react-native";
import PropTypes from "prop-types";
import glamorous, { withTheme } from "glamorous-native";

import { ThemePropType } from "../prop-types/theme";

class SearchBar extends PureComponent {
  static renderSeparator() {
    return (
      <glamorous.View
        height={StyleSheet.hairlineWidth}
        backgroundColor="#ced0ce"
      />
    );
  }

  constructor(props) {
    super(props);

    const searchText = props.searchText || "";
    this.state = {
      searchText,
    };
  }

  onChangeText = searchText => {
    this.setState({
      searchText,
    });

    this.props.onChangeText(searchText);
  };

  onPressClear = () => {
    const searchText = "";
    this.setState({
      searchText,
    });
    this.props.onChangeText(searchText);
  };

  renderSearchIcon() {
    const { theme } = this.props;
    return (
      <glamorous.Image
        source={require("../../assets/images/search-icon.png")}
        marginLeft={7}
        width={22}
        height={22}
        style={{ tintColor: theme.searchBarPlaceholderTextColor }}
      />
    );
  }

  renderTextInput() {
    const { theme, placeholderText } = this.props;
    const { searchText } = this.state;

    return (
      <glamorous.TextInput
        style={theme.searchBarTextStylenotesListItemTextStyle}
        flex={1}
        paddingTop={7}
        paddingLeft={7}
        paddingRight={7}
        paddingBottom={7}
        allowFontScaling={false}
        selectionColor="#657ef6"
        underlineColorAndroid="transparent"
        autoCapitalize="none"
        autoCorrect
        keyboardAppearance="dark"
        keyboardType="default"
        returnKeyType="default"
        clearButtonMode="while-editing"
        placeholder={placeholderText}
        placeholderTextColor={theme.searchBarPlaceholderTextColor}
        onChangeText={this.onChangeText}
        value={searchText}
      />
    );
  }

  renderClearButton() {
    const { theme } = this.props;
    if (Platform.OS === "android") {
      return (
        <glamorous.TouchableOpacity onPress={this.onPressClear}>
          <glamorous.Image
            source={require("../../assets/images/modal-close-button.png")}
            width={22}
            height={22}
            hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}
            marginRight={7}
            style={{ tintColor: theme.searchBarPlaceholderTextColor }}
          />
        </glamorous.TouchableOpacity>
      );
    }

    return null;
  }

  render() {
    return (
      <glamorous.View>
        <glamorous.View
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          marginTop={7}
          marginBottom={7}
          marginLeft={10}
          marginRight={Platform.OS === "ios" ? 13 : 10}
        >
          {this.renderSearchIcon()}
          {this.renderTextInput()}
          {this.renderClearButton()}
        </glamorous.View>
        {SearchBar.renderSeparator()}
      </glamorous.View>
    );
  }
}

SearchBar.propTypes = {
  theme: ThemePropType.isRequired,
  placeholderText: PropTypes.string,
  searchText: PropTypes.string,
  onChangeText: PropTypes.func.isRequired,
};

SearchBar.defaultProps = {
  placeholderText: "Search",
  searchText: "",
};

export default withTheme(SearchBar);
