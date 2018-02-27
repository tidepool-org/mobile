import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Alert, RefreshControl } from "react-native";
import glamorous, { withTheme } from "glamorous-native";

import Colors from "../constants/Colors";
import NotesListItem from "./NotesListItem";
import { ProfilePropType } from "../prop-types/profile";
import { CommentPropType } from "../prop-types/comment";
import { UserPropType } from "../prop-types/user";

// TODO: use NotePropType for notes and add full schema for it

class NotesList extends PureComponent {
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
      refreshing: false,
    };
  }

  componentDidMount() {
    if (this.props.errorMessage) {
      NotesList.showErrorMessageAlert();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errorMessage && !this.props.errorMessage) {
      NotesList.showErrorMessageAlert();
    }

    if (!nextProps.fetching && this.props.fetching) {
      this.setState({ refreshing: false });
    }
  }

  onRefresh = () => {
    const { notesFetchAsync, currentProfile } = this.props;

    this.setState({ refreshing: true });

    notesFetchAsync({ profile: currentProfile });
  };

  keyExtractor = item => item.id;

  renderNote = ({ item }) => (
    <NotesListItem
      note={item}
      currentUser={this.props.currentUser}
      currentProfile={this.props.currentProfile}
      commentsFetchData={this.props.commentsFetchDataByMessageId[item.id]}
      commentsFetchAsync={this.props.commentsFetchAsync}
      navigateEditNote={this.props.navigateEditNote}
      onDeleteNotePressed={this.props.onDeleteNotePressed}
      navigateAddComment={this.props.navigateAddComment}
      navigateEditComment={this.props.navigateEditComment}
    />
  );

  render() {
    const { notes } = this.props;

    return (
      <glamorous.FlatList
        style={{
          backgroundColor: Colors.veryLightGrey, // TODO: use theme rather than color directly
        }}
        data={notes}
        extraData={this.state}
        keyExtractor={this.keyExtractor}
        renderItem={this.renderNote}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh}
          />
        }
      />
    );
  }
}

NotesList.propTypes = {
  currentUser: UserPropType.isRequired,
  currentProfile: ProfilePropType.isRequired,
  notes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      timestamp: PropTypes.instanceOf(Date),
      messageText: PropTypes.string.isRequired,
    })
  ).isRequired,
  errorMessage: PropTypes.string,
  fetching: PropTypes.bool,
  notesFetchAsync: PropTypes.func.isRequired,
  commentsFetchAsync: PropTypes.func.isRequired,
  commentsFetchDataByMessageId: PropTypes.objectOf(
    PropTypes.shape({
      comments: PropTypes.arrayOf(CommentPropType),
      errorMessage: PropTypes.string,
      fetching: PropTypes.bool,
      fetched: PropTypes.bool,
    })
  ),
  navigateEditNote: PropTypes.func.isRequired,
  onDeleteNotePressed: PropTypes.func.isRequired,
  navigateAddComment: PropTypes.func.isRequired,
  navigateEditComment: PropTypes.func.isRequired,
};

NotesList.defaultProps = {
  errorMessage: "",
  fetching: false,
  commentsFetchDataByMessageId: {},
};

export default withTheme(NotesList);
