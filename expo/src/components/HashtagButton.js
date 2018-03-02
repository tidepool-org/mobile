import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import glamorous, { withTheme } from "glamorous-native";

import { ThemePropType } from "../prop-types/theme";
import Colors from "../constants/Colors";

class HashtagButton extends PureComponent {
  render() {
    const { onPress, hashtag, theme } = this.props;
    return (
      <glamorous.TouchableHighlight
        underlayColor="#bce3e8"
        onPress={onPress}
        accessibilityComponentType="button"
        height={36}
        paddingLeft={8}
        paddingRight={8}
        backgroundColor={Colors.white}
        borderRadius={18}
        borderColor="#a7a7a7"
        borderWidth={1}
        overflow="hidden"
      >
        <glamorous.Text
          style={theme.hashtagButtonTextStyle}
          allowFontScaling={false}
        >
          {hashtag}
        </glamorous.Text>
      </glamorous.TouchableHighlight>
    );
  }
}

HashtagButton.propTypes = {
  hashtag: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  theme: ThemePropType.isRequired,
};

export default withTheme(HashtagButton);
