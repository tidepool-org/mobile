import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import glamorous, { withTheme } from "glamorous-native";

import { ThemePropType } from "../prop-types/theme";
import HashtagButton from "./HashtagButton";

class HashtagPicker extends PureComponent {
  renderHashTagButtons() {
    const { hashtags, onPress } = this.props;

    return hashtags.map(hashtag => (
      <glamorous.View padding={6} key={hashtag}>
        <HashtagButton hashtag={hashtag} onPress={onPress} />
      </glamorous.View>
    ));
  }

  render() {
    const { theme } = this.props;

    return (
      <glamorous.ScrollView
        horizontal
        flex={1}
        contentContainerStyle={{ alignItems: "center" }}
        flexDirection="row"
        maxHeight={54}
        backgroundColor={theme.colors.lightBackground}
      >
        {this.renderHashTagButtons()}
      </glamorous.ScrollView>
    );
  }
}

HashtagPicker.propTypes = {
  hashtags: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  onPress: PropTypes.func.isRequired,
  theme: ThemePropType.isRequired,
};

export default withTheme(HashtagPicker);
