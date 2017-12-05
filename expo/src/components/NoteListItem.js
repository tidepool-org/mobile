import React from "react";
import PropTypes from "prop-types";
import { ViewPropTypes } from "react-native";
import glamorous, { withTheme } from "glamorous-native";

import HashtagText from "./HashtagText";
import ThemePropTypes from "../themes/ThemePropTypes";
import LinearGradient from "./LinearGradient";

const NoteListItem = ({ theme, style, time, text }) => (
  <glamorous.View style={style} backgroundColor="white">
    <glamorous.Text
      allowFontScaling={false}
      style={theme.noteListItemTimeStyle}
      marginTop={7}
      marginLeft={12}
      marginRight={12}
    >
      {time}
    </glamorous.Text>
    <glamorous.Text
      allowFontScaling={false}
      style={theme.noteListItemTextStyle}
      flexDirection="row"
      marginTop={7}
      marginLeft={12}
      marginRight={12}
      marginBottom={7}
    >
      {HashtagText({
        boldStyle: theme.noteListItemHashtagStyle,
        normalStyle: theme.noteListItemTextStyle,
        text,
      })}
    </glamorous.Text>
    <LinearGradient
      colors={["#e4e4e5", "#ededee", "#f7f7f8"]}
      style={{ height: 10 }}
    />
  </glamorous.View>
);

NoteListItem.propTypes = {
  theme: ThemePropTypes.isRequired,
  style: ViewPropTypes.style,
  time: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};

NoteListItem.defaultProps = {
  style: null,
};

export default withTheme(NoteListItem);
