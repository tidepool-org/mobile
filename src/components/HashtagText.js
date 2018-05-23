import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Text } from "react-native";
import glamorous from "glamorous-native";
import twitter from "twitter-text";

class HashtagText extends PureComponent {
  render() {
    const { boldStyle, normalStyle, text } = this.props;

    const textComponents = [];

    const entities = twitter.extractHashtagsWithIndices(text);

    let nextNormalTextIndex = 0;
    entities.forEach(entity => {
      const hashtagStartIndex = entity.indices[0];
      const hashtagEndIndex = entity.indices[1];

      if (hashtagStartIndex > nextNormalTextIndex) {
        textComponents.push(
          <glamorous.Text
            key={nextNormalTextIndex}
            allowFontScaling={false}
            style={normalStyle}
          >
            {text.substring(nextNormalTextIndex, hashtagStartIndex)}
          </glamorous.Text>,
        );
      }

      textComponents.push(
        <glamorous.Text
          key={hashtagStartIndex}
          allowFontScaling={false}
          style={boldStyle}
        >
          {text.substring(hashtagStartIndex, hashtagEndIndex)}
        </glamorous.Text>,
      );

      nextNormalTextIndex = hashtagEndIndex;
    });

    if (nextNormalTextIndex < text.length) {
      textComponents.push(
        <glamorous.Text
          key={nextNormalTextIndex}
          allowFontScaling={false}
          style={normalStyle}
        >
          {text.substring(nextNormalTextIndex, text.length)}
        </glamorous.Text>,
      );
    }

    return textComponents;
  }
}

HashtagText.propTypes = {
  boldStyle: Text.propTypes.style,
  normalStyle: Text.propTypes.style,
  text: PropTypes.string.isRequired,
};

HashtagText.defaultProps = {
  boldStyle: null,
  normalStyle: null,
};

export default HashtagText;
