import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { ViewPropTypes } from "react-native";
import glamorous, { withTheme } from "glamorous-native";

import HashtagText from "./HashtagText";
import { ThemePropType } from "../prop-types/theme";
import { formatDateForNoteList } from "../utils/formatDate";
import { CommentPropType } from "../prop-types/comment";

class AddOrEditCommentScreenComment extends PureComponent {
  constructor(props) {
    super(props);

    const messageText = props.comment ? props.comment.messageText : "";
    this.state = {
      isDirty: false,
      messageText,
    };

    this.originalMessageText = messageText;
    this.isEditMode = !!props.comment;
    this.isAddMode = !this.isEditMode;
  }

  componentDidMount() {
    if (this.textInput) {
      this.focusTimer = setTimeout(() => {
        this.textInput.focus();
      }, 450);
    }
  }

  componentWillUnmount() {
    if (this.focusTimer) {
      clearTimeout(this.focusTimer);
    }
  }

  onPressSave = () => {
    const { timestampAddComment } = this.props;
    const messageText = this.state.messageText.trim();
    this.props.onPressSave({ messageText, timestampAddComment });
  };

  onPressCancel = () => {
    this.props.onPressCancel();
  };

  onChangeText = messageText => {
    this.setState({
      messageText,
      isDirty: this.getDirtyState({ messageText }),
    });
  };

  getDirtyState(newState) {
    let isDirty = false;

    if (newState.messageText.trim().length > 0) {
      if (newState.messageText !== this.originalMessageText) {
        isDirty = true;
      }
    }
    return isDirty;
  }

  renderCancelButton() {
    const { theme } = this.props;

    return (
      <glamorous.TouchableOpacity
        marginRight={10}
        marginTop={7}
        hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}
        onPress={this.onPressCancel}
      >
        <glamorous.Text
          style={theme.editButtonTextStyle}
          allowFontScaling={false}
          numberOfLines={1}
        >
          Cancel
        </glamorous.Text>
      </glamorous.TouchableOpacity>
    );
  }

  renderSaveOrPostButton() {
    const { theme } = this.props;
    const text = this.isAddMode ? "Post" : "Save";
    const disabled = !this.state.isDirty;

    return (
      <glamorous.TouchableOpacity
        marginRight={10}
        marginTop={7}
        hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}
        onPress={this.onPressSave}
        disabled={disabled}
      >
        <glamorous.Text
          style={
            disabled
              ? theme.editButtonTextDisabledStyle
              : theme.editButtonTextStyle
          }
          allowFontScaling={false}
          numberOfLines={1}
        >
          {text}
        </glamorous.Text>
      </glamorous.TouchableOpacity>
    );
  }

  // FIXME: Text that doesn't fill the TextInput is centered vertically on Android, but, not iOS. Ideally it seems the text on Android should be aligned as on iOS
  renderEditableComment() {
    const { theme } = this.props;

    return (
      <glamorous.View flex={1}>
        <glamorous.TextInput
          innerRef={textInput => {
            this.textInput = textInput;
          }}
          style={theme.commentsListItemTextStyle}
          flex={1}
          paddingTop={7}
          paddingLeft={12}
          paddingRight={12}
          paddingBottom={7}
          allowFontScaling={false}
          multiline
          selectionColor="#657ef6"
          underlineColorAndroid="transparent"
          autoCapitalize="sentences"
          autoCorrect
          keyboardAppearance="dark"
          keyboardType="default"
          returnKeyType="default"
          onChangeText={this.onChangeText}
        >
          <HashtagText
            boldStyle={theme.notesListItemHashtagStyle}
            normalStyle={theme.notesListItemTextStyle}
            text={this.state.messageText}
          />
        </glamorous.TextInput>
        <glamorous.View flexDirection="row" justifyContent="flex-end">
          {this.renderCancelButton()}
          {this.renderSaveOrPostButton()}
        </glamorous.View>
      </glamorous.View>
    );
  }

  renderNonEditableComment() {
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

  render() {
    const { allowEditing } = this.props;

    if (allowEditing) {
      return this.renderEditableComment();
    }

    return this.renderNonEditableComment();
  }
}

AddOrEditCommentScreenComment.propTypes = {
  theme: ThemePropType.isRequired,
  style: ViewPropTypes.style,
  comment: CommentPropType,
  timestampAddComment: PropTypes.instanceOf(Date),
  allowEditing: PropTypes.bool,
  onPressSave: PropTypes.func,
  onPressCancel: PropTypes.func,
};

AddOrEditCommentScreenComment.defaultProps = {
  style: null,
  allowEditing: false,
  onPressSave: null,
  onPressCancel: null,
  comment: null,
  timestampAddComment: null,
};

export default withTheme(AddOrEditCommentScreenComment);
