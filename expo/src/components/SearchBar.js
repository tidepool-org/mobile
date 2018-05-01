import React, { PureComponent } from "react";
import { Platform, StyleSheet } from "react-native";
import PropTypes from "prop-types";
import glamorous, { withTheme } from "glamorous-native";

// TODO: When touching anywhere outside the SearchBar, should dismiss keyboard
// TODO: Add the auto show/hide of SearchBar, similar to Tidepool Mobile app

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
        <glamorous.TouchableOpacity
          hitSlop={{ left: 20, right: 20, top: 20, bottom: 20 }}
          onPress={this.onPressClear}
        >
          <glamorous.Image
            source={require("../../assets/images/modal-close-button.png")}
            width={22}
            height={22}
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
