import React from "react";
import PropTypes from "prop-types";
import { ViewStylePropTypes } from "react-native";
import glamorous, { withTheme } from "glamorous-native";

import ThemePropTypes from "../themes/ThemePropTypes";

const NoteListItem = ({ theme, style, text }) => (
  <glamorous.View style={style} flexDirection="row" padding={8}>
    <glamorous.Text style={theme.noteListItemTextStyle}>{text}</glamorous.Text>
  </glamorous.View>
);

NoteListItem.propTypes = {
  theme: ThemePropTypes.isRequired,
  style: ViewStylePropTypes,
  text: PropTypes.string.isRequired,
};

NoteListItem.defaultProps = {
  style: null,
};

export default withTheme(NoteListItem);
