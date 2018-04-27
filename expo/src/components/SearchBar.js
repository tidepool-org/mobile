import React, { PureComponent } from "react";
import { Platform } from "react-native";
import PropTypes from "prop-types";
import glamorous, { withTheme } from "glamorous-native";

import { ThemePropType } from "../prop-types/theme";

class SearchBar extends PureComponent {
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
            style={{ tintColor: theme.searchBarPlaceholderTextColor }}
          />
        </glamorous.TouchableOpacity>
      );
    }

    return null;
  }

  render() {
    return (
      <glamorous.View
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        marginTop={7}
        marginBottom={7}
      >
        {this.renderSearchIcon()}
        {this.renderTextInput()}
        {this.renderClearButton()}
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
