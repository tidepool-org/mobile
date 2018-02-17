import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import glamorous, { withTheme } from "glamorous-native";

import Colors from "../../src/constants/Colors";
import HashtagText from "./HashtagText";
import { formatDateForNoteList } from "../utils/formatDate";
import { ThemePropType } from "../prop-types/theme";
import { ProfilePropType } from "../prop-types/profile";

class AddOrEditCommentScreenNote extends PureComponent {
  shouldRenderUserLabelSection() {
    const { note } = this.props;
    return note.userId !== note.groupId && note.userFullName;
  }

  renderUserLabelSection() {
    const { theme, currentProfile, note } = this.props;

    const userLabelText = `${note.userFullName} to ${currentProfile.fullName}`;

    return (
      <glamorous.View
        flexDirection="row"
        justifyContent="space-between"
        zIndex={1}
      >
        <glamorous.Text
          allowFontScaling={false}
          numberOfLines={1}
          style={theme.notesListItemMetadataStyle}
          marginTop={7}
          marginLeft={12}
          marginRight={12}
          flexShrink={1}
        >
          {userLabelText}
        </glamorous.Text>
      </glamorous.View>
    );
  }

  renderDateSection() {
    const { theme, note } = this.props;

    return (
      <glamorous.View
        flexDirection="row"
        justifyContent="flex-start"
        zIndex={1}
      >
        <glamorous.Text
          allowFontScaling={false}
          style={theme.notesListItemMetadataStyle}
          marginTop={7}
          marginLeft={12}
          marginRight={12}
        >
          {formatDateForNoteList(note.timestamp)}
        </glamorous.Text>
      </glamorous.View>
    );
  }

  renderNote() {
    const { theme, note } = this.props;

    return (
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
          text={note.messageText}
        />
      </glamorous.Text>
    );
  }

  render() {
    return (
      <glamorous.View backgroundColor={Colors.white}>
        <glamorous.View>
          {this.shouldRenderUserLabelSection() && this.renderUserLabelSection()}
          {this.renderDateSection()}
          {this.renderNote()}
        </glamorous.View>
      </glamorous.View>
    );
  }
}

AddOrEditCommentScreenNote.propTypes = {
  theme: ThemePropType.isRequired,
  currentProfile: ProfilePropType.isRequired,
  note: PropTypes.shape({
    id: PropTypes.string.isRequired,
    timestamp: PropTypes.instanceOf(Date),
    messageText: PropTypes.string.isRequired,
  }).isRequired,
};

export default withTheme(AddOrEditCommentScreenNote);
