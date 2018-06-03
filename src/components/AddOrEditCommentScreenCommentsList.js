import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { StyleSheet } from "react-native";
import glamorous, { withTheme } from "glamorous-native";

import AddOrEditCommentScreenComment from "./AddOrEditCommentScreenComment";
import Colors from "../../src/constants/Colors";
import { ThemePropType } from "../prop-types/theme";
import { CommentPropType } from "../prop-types/comment";
import { UserPropType } from "../prop-types/user";

class AddOrEditCommentScreenCommentsList extends PureComponent {
  onPressSave = ({ messageText, timestampAddComment }) => {
    this.props.onPressSave({ messageText, timestampAddComment });
  };

  onPressCancel = () => {
    this.props.onPressCancel();
  };

  onEditableCommentLayout = event => {
    this.props.onEditableCommentLayout(event);
  };

  static renderSeparator() {
    return (
      <glamorous.View
        marginTop={7}
        marginBottom={7}
        height={StyleSheet.hairlineWidth}
        backgroundColor="#CED0CE"
      />
    );
  }

  renderEditableComment({ comment, timestampAddComment }) {
    const { theme, currentUser } = this.props;
    const key = comment ? comment.id : "add-comment";

    return (
      <glamorous.View key={key} onLayout={this.onEditableCommentLayout}>
        {AddOrEditCommentScreenCommentsList.renderSeparator()}
        <glamorous.View height={125}>
          <AddOrEditCommentScreenComment
            theme={theme}
            currentUserId={currentUser.userId}
            comment={comment}
            timestampAddComment={timestampAddComment}
            allowEditing
            onPressSave={this.onPressSave}
            onPressCancel={this.onPressCancel}
          />
        </glamorous.View>
        {AddOrEditCommentScreenCommentsList.renderSeparator()}
      </glamorous.View>
    );
  }

  renderNonEditableComment({ comment }) {
    const { theme, currentUser } = this.props;

    return (
      <glamorous.View key={comment.id}>
        <AddOrEditCommentScreenComment
          key={comment.id}
          theme={theme}
          currentUserId={currentUser.userId}
          comment={comment}
        />
      </glamorous.View>
    );
  }

  renderComments() {
    const {
      commentsFetchData,
      commentsFetchData: { comments },
      timestampAddComment,
    } = this.props;

    const renderedComments = comments.map(comment => {
      // Don't render the comment that has same id as the note
      if (comment.id === this.props.note.id) {
        return null;
      }

      // If editing a comment, render editable comment
      if (this.props.comment && this.props.comment.id === comment.id) {
        return this.renderEditableComment({ comment });
      }

      // Render non-editable comment
      return this.renderNonEditableComment({ comment });
    });

    // If no comment was provided to edit, then we're adding a comment, so append an editable comment to end of the rendered comments
    if (!commentsFetchData.errorMessage && !this.props.comment) {
      renderedComments.push(
        this.renderEditableComment({ comment: null, timestampAddComment })
      );
    }

    return renderedComments;
  }

  render() {
    return (
      <glamorous.View backgroundColor={Colors.white}>
        {this.renderComments()}
      </glamorous.View>
    );
  }
}

AddOrEditCommentScreenCommentsList.propTypes = {
  theme: ThemePropType.isRequired,
  currentUser: UserPropType.isRequired,
  note: PropTypes.shape({
    id: PropTypes.string.isRequired,
    timestamp: PropTypes.instanceOf(Date),
    messageText: PropTypes.string.isRequired,
  }).isRequired,
  comment: CommentPropType,
  timestampAddComment: PropTypes.instanceOf(Date),
  commentsFetchData: PropTypes.shape({
    comments: PropTypes.arrayOf(CommentPropType),
    errorMessage: PropTypes.string,
    fetching: PropTypes.bool,
    fetched: PropTypes.bool,
  }),
  onEditableCommentLayout: PropTypes.func.isRequired,
  onPressSave: PropTypes.func,
  onPressCancel: PropTypes.func,
};

AddOrEditCommentScreenCommentsList.defaultProps = {
  commentsFetchData: {
    comments: [],
    errorMessage: "",
    fetching: false,
    fetched: false,
  },
  comment: null,
  timestampAddComment: null,
  onPressSave: null,
  onPressCancel: null,
};

export default withTheme(AddOrEditCommentScreenCommentsList);
