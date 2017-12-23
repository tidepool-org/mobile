import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { ViewPropTypes } from "react-native";
import glamorous, { withTheme } from "glamorous-native";

import HashtagText from "./HashtagText";
import ThemePropTypes from "../themes/ThemePropTypes";
import LinearGradient from "./LinearGradient";

class NotesListItem extends PureComponent {
  render() {
    const { theme, style, timestampFormatted, messageText } = this.props;

    return (
      <glamorous.View style={style} backgroundColor="white">
        <glamorous.Text
          allowFontScaling={false}
          style={theme.notesListItemTimeStyle}
          marginTop={7}
          marginLeft={12}
          marginRight={12}
        >
          {timestampFormatted}
        </glamorous.Text>
        <glamorous.Text
          allowFontScaling={false}
          style={theme.notesListItemTextStyle}
          flexDirection="row"
          marginTop={7}
          marginLeft={12}
          marginRight={12}
          marginBottom={7}
        >
          <HashtagText
            boldStyle={theme.notesListItemHashtagStyle}
            normalStyle={theme.notesListItemTextStyle}
            text={messageText}
          />
        </glamorous.Text>
        <LinearGradient
          colors={["#e4e4e5", "#ededee", "#f7f7f8"]}
          style={{ height: 10 }}
        />
      </glamorous.View>
    );
  }
}

NotesListItem.propTypes = {
  theme: ThemePropTypes.isRequired,
  style: ViewPropTypes.style,
  timestampFormatted: PropTypes.string.isRequired,
  messageText: PropTypes.string.isRequired,
};

NotesListItem.defaultProps = {
  style: null,
};

export default withTheme(NotesListItem);
