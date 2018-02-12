import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Alert, Animated, ViewPropTypes, LayoutAnimation } from "react-native";
import glamorous, { withTheme } from "glamorous-native";

import HashtagText from "./HashtagText";
import LinearGradient from "./LinearGradient";
import NotesListItemAddComment from "./NotesListItemAddComment";
import NotesListItemComment from "./NotesListItemComment";
import { formatDateForNoteList } from "../utils/formatDate";
import { ThemePropType } from "../prop-types/theme";
import { CommentPropType } from "../prop-types/comment";
import { UserPropType } from "../prop-types/user";
import { ProfilePropType } from "../prop-types/profile";

// FIXME: Initial tap after having done a pull-to-refresh is ignored?? We don't even get the onPress event! Tapping again then works (and continues to work) throughout the list. NB: Android doesn't seem to have this issue! Only iOS!

// TODO: use NotePropType for note and add full schema for it
// TODO: when resetting comments (via reload of messages, or sign out), we should cancel outstanding fetch requests
// TODO: consider showing an activity indicator for the loading of graph and comments data, and then animate all of that (graph and comments) together when loaded

class NotesListItem extends PureComponent {
  static showErrorMessageAlert() {
    // TODO: strings - Use some i18n module for these and other UI strings
    Alert.alert(
      "Unknown Error Occurred",
      "An unknown error occurred. We are working hard to resolve this issue.",
      [{ text: "OK" }]
    );
  }

  constructor(props) {
    super(props);

    this.state = {
      expanded: props.initiallyExpanded,
      fadeAnimation: new Animated.Value(0),
    };
  }

  componentDidMount() {
    Animated.timing(this.state.fadeAnimation, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    }).start();

    if (this.props.commentsFetchData.errorMessage) {
      NotesListItem.showErrorMessageAlert();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.commentsFetchData.errorMessage &&
      !this.props.commentsFetchData.errorMessage
    ) {
      NotesListItem.showErrorMessageAlert();
    }

    if (
      nextProps.commentsFetchData.comments.length > 0 &&
      this.props.commentsFetchData.comments.length === 0
    ) {
      LayoutAnimation.configureNext({
        ...LayoutAnimation.Presets.easeInEaseOut,
        duration: 175,
        useNativeDriver: true,
      });
    }
  }

  onPressNote = () => {
    if (this.props.allowExpansionToggle) {
      const wasExpanded = this.state.expanded;
      this.setState({ expanded: !wasExpanded });
      if (!wasExpanded && !this.props.commentsFetchData.fetched) {
        this.props.commentsFetchAsync({ messageId: this.props.note.id });
      }
      LayoutAnimation.configureNext({
        ...LayoutAnimation.Presets.easeInEaseOut,
        duration: 175,
        useNativeDriver: true,
      });
    }
  };

  onPressEditNote = () => {
    const { note } = this.props;
    this.props.navigateEditNote({ note });
  };

  onPressAddComment = () => {
    // TODO: If comments are still loading and user taps Add Comment, then the existing comments won't be shown on the Add Comment screen, even once commentsFetch has completed. We should probably fix that so that the while commentsFetch is in fetching state, and completes, while Add Comment screen is current, that it loads those comments? Should probably also have a comments loading indicator both in notes list and in Add Comment screen?
    const { note, commentsFetchData } = this.props;
    this.props.navigateAddComment({ note, commentsFetchData });
  };

  onPressEditComment = ({ comment }) => {
    // TODO: If comments are still loading and user taps Add Comment, then the existing comments won't be shown on the Add Comment screen, even once commentsFetch has completed. We should probably fix that so that the while commentsFetch is in fetching state, and completes, while Add Comment screen is current, that it loads those comments? Should probably also have a comments loading indicator both in notes list and in Add Comment screen?
    const { note, commentsFetchData } = this.props;
    this.props.navigateEditComment({ note, commentsFetchData, comment });
  };

  shouldRenderUserLabelSection() {
    const { note } = this.props;
    return note.userId !== note.groupId && note.userFullName;
  }

  renderEditButton() {
    const { theme, note, currentUser } = this.props;

    if (
      this.props.allowEditing &&
      this.state.expanded &&
      note.userId === currentUser.userId
    ) {
      return (
        <glamorous.TouchableOpacity
          marginLeft="auto"
          marginRight={10}
          marginTop={7}
          hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}
          onPress={this.onPressEditNote}
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

  renderUserLabelSection() {
    const { theme, currentProfile, note } = this.props;

    if (this.shouldRenderUserLabelSection()) {
      const userLabelText = `${note.userFullName} to ${
        currentProfile.fullName
      }`;

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
          {this.renderEditButton()}
        </glamorous.View>
      );
    }

    return null;
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
        {!this.shouldRenderUserLabelSection() && this.renderEditButton()}
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

  renderComments() {
    const { currentUser, allowEditing } = this.props;

    if (this.state.expanded) {
      const { theme, commentsFetchData: { comments } } = this.props;
      return comments.map(comment => {
        // Skip rendering the comment that has same id as the note
        if (comment.id !== this.props.note.id) {
          return (
            <NotesListItemComment
              key={comment.id}
              theme={theme}
              currentUserId={currentUser.userId}
              comment={comment}
              allowEditing={allowEditing}
              onPressEditComment={this.onPressEditComment}
            />
          );
        }
        return null;
      });
    }

    return null;
  }

  renderNotesListItemAddComment() {
    if (this.props.allowEditing && this.state.expanded) {
      return <NotesListItemAddComment onPress={this.onPressAddComment} />;
    }

    return null;
  }

  renderSeparator() {
    const { includeSeparator } = this.props;

    if (includeSeparator) {
      return (
        <LinearGradient
          colors={["#e4e4e5", "#ededee", "#f7f7f8"]}
          style={{ height: 10 }}
        />
      );
    }

    return null;
  }

  render() {
    const { style } = this.props;

    return (
      <Animated.View
        style={[
          style,
          { backgroundColor: "white", opacity: this.state.fadeAnimation },
        ]}
      >
        <glamorous.TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            this.onPressNote();
          }}
        >
          {this.renderUserLabelSection()}
          {this.renderDateSection()}
          {this.renderNote()}
        </glamorous.TouchableOpacity>
        {this.renderComments()}
        {this.renderNotesListItemAddComment()}
        {this.renderSeparator()}
      </Animated.View>
    );
  }
}

NotesListItem.propTypes = {
  theme: ThemePropType.isRequired,
  style: ViewPropTypes.style,
  allowEditing: PropTypes.bool,
  initiallyExpanded: PropTypes.bool,
  allowExpansionToggle: PropTypes.bool,
  includeSeparator: PropTypes.bool,
  currentUser: UserPropType.isRequired,
  currentProfile: ProfilePropType.isRequired,
  note: PropTypes.shape({
    id: PropTypes.string.isRequired,
    timestamp: PropTypes.instanceOf(Date),
    messageText: PropTypes.string.isRequired,
  }).isRequired,
  commentsFetchAsync: PropTypes.func.isRequired,
  commentsFetchData: PropTypes.shape({
    comments: PropTypes.arrayOf(CommentPropType),
    errorMessage: PropTypes.string,
    fetching: PropTypes.bool,
    fetched: PropTypes.bool,
  }),
  navigateEditNote: PropTypes.func.isRequired,
  navigateAddComment: PropTypes.func.isRequired,
  navigateEditComment: PropTypes.func.isRequired,
};

NotesListItem.defaultProps = {
  style: null,
  allowEditing: true,
  initiallyExpanded: false,
  allowExpansionToggle: true,
  includeSeparator: true,
  commentsFetchData: {
    comments: [],
    errorMessage: "",
    fetching: false,
    fetched: false,
  },
};

export default withTheme(NotesListItem);
