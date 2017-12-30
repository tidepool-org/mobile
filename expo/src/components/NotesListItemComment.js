import React, { PureComponent } from "react";
import { ViewPropTypes } from "react-native";
import glamorous, { withTheme } from "glamorous-native";

import HashtagText from "./HashtagText";
import { ThemePropType } from "../prop-types/theme";
import formatDate from "../utils/formatDate";
import { CommentPropType } from "../prop-types/comment";

class NotesListItemComment extends PureComponent {
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
            {formatDate(comment.timestamp)}
          </glamorous.Text>
          <glamorous.TouchableOpacity
            marginLeft="auto"
            marginRight={10}
            marginTop={7}
            hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}
          >
            <glamorous.Text
              style={theme.editButtonTextStyle}
              allowFontScaling={false}
              numberOfLines={1}
            >
              Edit
            </glamorous.Text>
          </glamorous.TouchableOpacity>
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
  comment: CommentPropType.isRequired,
};

NotesListItemComment.defaultProps = {
  style: null,
};

export default withTheme(NotesListItemComment);
