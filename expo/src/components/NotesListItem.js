import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import {
  Alert,
  ViewPropTypes,
  TouchableOpacity,
  LayoutAnimation,
} from "react-native";
import glamorous, { withTheme } from "glamorous-native";

import HashtagText from "./HashtagText";
import LinearGradient from "./LinearGradient";
import NotesListItemAddComment from "./NotesListItemAddComment";
import NotesListItemComment from "./NotesListItemComment";
import formatDate from "../utils/formatDate";
import { ThemePropType } from "../prop-types/theme";
import { CommentPropType } from "../prop-types/comment";

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

    this.state = { expanded: props.initiallyExpanded };
  }

  componentDidMount() {
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
        duration: 150,
      });
    }
  }

  onPress = () => {
    this.setState({ expanded: !this.state.expanded });
    this.props.commentsFetchAsync({ messageId: this.props.note.id });
    LayoutAnimation.configureNext({
      ...LayoutAnimation.Presets.easeInEaseOut,
      duration: 150,
    });
  };

  renderEditButton() {
    const { theme } = this.props;

    if (this.state.expanded) {
      return (
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
      );
    }

    return null;
  }
  renderComments() {
    if (this.state.expanded) {
      const { theme, commentsFetchData: { comments } } = this.props;
      return comments.map(comment => {
        // Skip rendering the comment that has same id as the note
        if (comment.id !== this.props.note.id) {
          return (
            <NotesListItemComment
              key={comment.id}
              theme={theme}
              comment={comment}
            />
          );
        }
        return null;
      });
    }

    return null;
  }

  renderNotesListItemAddComment() {
    if (this.state.expanded) {
      return <NotesListItemAddComment />;
    }

    return null;
  }

  render() {
    const { theme, style, note } = this.props;

    return (
      <glamorous.View style={style} backgroundColor="white">
        <TouchableOpacity activeOpacity={1} onPress={this.onPress}>
          <glamorous.View
            flexDirection="row"
            justifyContent="flex-start"
            zIndex={1}
          >
            <glamorous.Text
              allowFontScaling={false}
              style={theme.notesListItemTimeStyle}
              marginTop={7}
              marginLeft={12}
              marginRight={12}
            >
              {formatDate(note.timestamp)}
            </glamorous.Text>
            {this.renderEditButton()}
          </glamorous.View>
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
        </TouchableOpacity>
        {this.renderComments()}
        {this.renderNotesListItemAddComment()}
        <LinearGradient
          colors={["#e4e4e5", "#ededee", "#f7f7f8"]}
          style={{ height: 10 }}
        />
      </glamorous.View>
    );
  }
}

NotesListItem.propTypes = {
  theme: ThemePropType.isRequired,
  style: ViewPropTypes.style,
  initiallyExpanded: PropTypes.bool,
  note: PropTypes.shape({
    id: PropTypes.string.isRequired,
    timestamp: PropTypes.instanceOf(Date),
    messageText: PropTypes.string.isRequired,
  }).isRequired,
  commentsFetchAsync: PropTypes.func.isRequired,
  commentsFetchData: PropTypes.shape({
    errorMessage: PropTypes.string,
    fetching: PropTypes.bool,
    comments: PropTypes.arrayOf(CommentPropType),
  }),
};

NotesListItem.defaultProps = {
  style: null,
  initiallyExpanded: false,
  commentsFetchData: {
    errorMessage: "",
    fetching: false,
    comments: [],
  },
};

export default withTheme(NotesListItem);
