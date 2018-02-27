import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { ViewPropTypes } from "react-native";
import glamorous, { withTheme } from "glamorous-native";

import HashtagText from "./HashtagText";
import { ThemePropType } from "../prop-types/theme";
import { formatDateForNoteList } from "../utils/formatDate";
import { CommentPropType } from "../prop-types/comment";

class NotesListItemComment extends PureComponent {
  onPressEditComment = () => {
    const { comment } = this.props;
    this.props.onPressEditComment({ comment });
  };

  renderEditButton() {
    const { theme, currentUserId, comment, allowEditing } = this.props;

    if (allowEditing && comment.userId === currentUserId) {
      return (
        <glamorous.TouchableOpacity
          marginLeft="auto"
          marginRight={10}
          marginTop={7}
          hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}
          onPress={this.onPressEditComment}
        >
          <glamorous.Text
            style={theme.editButtonTextStyle}
            allowFontScaling={false}
            numberOfLines={1}
          >
            Edit
          </glamorous.Text>
        </glamorous.TouchableOpacity>
      );
    }

    return null;
  }

  render() {
    const { theme, style, comment } = this.props;

    return (
      <glamorous.View style={style} backgroundColor="white">
        <glamorous.View
          flexDirection="row"
          justifyContent="flex-start"
          zIndex={1}
        >
          <glamorous.Text
            style={theme.notesListItemUserFullNameStyle}
            flexShrink={1}
            allowFontScaling={false}
            numberOfLines={1}
            marginLeft={12}
            marginTop={7}
          >
            {comment.userFullName}
          </glamorous.Text>
          <glamorous.Text
            style={theme.notesListItemCommentTimeStyle}
            allowFontScaling={false}
            numberOfLines={1}
            marginLeft={10}
            marginRight={10}
            marginTop={7}
          >
            {formatDateForNoteList(comment.timestamp)}
          </glamorous.Text>
          {this.renderEditButton()}
        </glamorous.View>
        <glamorous.Text
          allowFontScaling={false}
          style={theme.notesListItemCommentTextStyle}
          flexDirection="row"
          marginLeft={12}
          marginTop={0}
          marginRight={12}
          marginBottom={7}
        >
          <HashtagText
            boldStyle={theme.notesListItemCommentHashtagStyle}
            normalStyle={theme.notesListItemCommentTextStyle}
            text={comment.messageText}
          />
        </glamorous.Text>
      </glamorous.View>
    );
  }
}

NotesListItemComment.propTypes = {
  theme: ThemePropType.isRequired,
  style: ViewPropTypes.style,
  currentUserId: PropTypes.string.isRequired,
  comment: CommentPropType.isRequired,
  allowEditing: PropTypes.bool,
  onPressEditComment: PropTypes.func.isRequired,
};

NotesListItemComment.defaultProps = {
  style: null,
  allowEditing: true,
};

export default withTheme(NotesListItemComment);
