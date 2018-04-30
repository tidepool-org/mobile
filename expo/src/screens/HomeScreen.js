import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Alert, StatusBar } from "react-native";
import glamorous, { ThemeProvider } from "glamorous-native";

import PrimaryTheme from "../themes/PrimaryTheme";
import Colors from "../constants/Colors";
import HomeScreenHeaderTitleContainer from "../containers/HomeScreenHeaderTitleContainer";
import HomeScreenHeaderLeftContainer from "../containers/HomeScreenHeaderLeftContainer";
import HomeScreenHeaderRightContainer from "../containers/HomeScreenHeaderRightContainer";
import NotesList from "../components/NotesList";
import { ProfilePropType } from "../prop-types/profile";
import { CommentPropType } from "../prop-types/comment";
import { UserPropType } from "../prop-types/user";

// TODO: notes - we need to handle empty notes list with the "add note" tip

class HomeScreen extends PureComponent {
  static navigationOptions = () => {
    const headerStyle = { backgroundColor: Colors.darkPurple };

    return {
      headerStyle,
      headerTitle: <HomeScreenHeaderTitleContainer />,
      headerLeft: <HomeScreenHeaderLeftContainer />,
      headerRight: <HomeScreenHeaderRightContainer />,
    };
  };

  constructor(props) {
    super(props);

    this.theme = PrimaryTheme;
  }

  componentDidMount() {
    this.props.notesFetchAsync({
      profile: this.props.currentProfile,
    });
  }

  onDeleteNotePressed = ({ note }) => {
    const { noteDeleteAsync, currentProfile } = this.props;

    Alert.alert(
      "Delete Note?",
      "Once you delete this note, it cannot be recovered.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => noteDeleteAsync({ currentProfile, note }),
          style: "destructive",
        },
      ]
    );
  };

  onDeleteCommentPressed = ({ note, comment }) => {
    const { commentDeleteAsync, currentProfile } = this.props;

    Alert.alert(
      "Delete Comment?",
      "Once you delete this comment, it cannot be recovered.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => commentDeleteAsync({ note, currentProfile, comment }),
          style: "destructive",
        },
      ]
    );
  };

  render() {
    const {
      currentUser,
      commentsFetchAsync,
      commentsFetchDataByMessageId,
      graphDataFetchAsync,
      graphDataFetchDataByMessageId,
      currentProfile,
      errorMessage,
      fetching,
      notes,
      notesFetchAsync,
      notesFetchSetSearchFilter,
      navigateEditNote,
      navigateAddComment,
      navigateEditComment,
    } = this.props;

    return (
      <ThemeProvider theme={this.theme}>
        <glamorous.View flex={1}>
          <StatusBar barStyle="light-content" />
          <NotesList
            currentUser={currentUser}
            notes={notes}
            fetching={fetching}
            errorMessage={errorMessage}
            currentProfile={currentProfile}
            notesFetchAsync={notesFetchAsync}
            notesFetchSetSearchFilter={notesFetchSetSearchFilter}
            commentsFetchAsync={commentsFetchAsync}
            commentsFetchDataByMessageId={commentsFetchDataByMessageId}
            graphDataFetchAsync={graphDataFetchAsync}
            graphDataFetchDataByMessageId={graphDataFetchDataByMessageId}
            navigateEditNote={navigateEditNote}
            onDeleteNotePressed={this.onDeleteNotePressed}
            navigateAddComment={navigateAddComment}
            navigateEditComment={navigateEditComment}
            onDeleteCommentPressed={this.onDeleteCommentPressed}
          />
        </glamorous.View>
      </ThemeProvider>
    );
  }
}

HomeScreen.propTypes = {
  currentUser: UserPropType.isRequired,
  notes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      timestamp: PropTypes.instanceOf(Date),
      messageText: PropTypes.string.isRequired,
    })
  ).isRequired,
  errorMessage: PropTypes.string,
  fetching: PropTypes.bool,
  currentProfile: ProfilePropType.isRequired,
  notesFetchAsync: PropTypes.func.isRequired,
  notesFetchSetSearchFilter: PropTypes.func.isRequired,
  commentsFetchAsync: PropTypes.func.isRequired,
  commentsFetchDataByMessageId: PropTypes.objectOf(
    PropTypes.shape({
      comments: PropTypes.arrayOf(CommentPropType),
      errorMessage: PropTypes.string,
      fetching: PropTypes.bool,
      fetched: PropTypes.bool,
    })
  ),
  graphDataFetchAsync: PropTypes.func.isRequired,
  graphDataFetchDataByMessageId: PropTypes.objectOf(
    PropTypes.shape({
      graphData: PropTypes.object,
      errorMessage: PropTypes.string,
      fetching: PropTypes.bool,
      fetched: PropTypes.bool,
    })
  ),
  navigateEditNote: PropTypes.func.isRequired,
  navigateAddComment: PropTypes.func.isRequired,
  navigateEditComment: PropTypes.func.isRequired,
  noteDeleteAsync: PropTypes.func.isRequired,
  commentDeleteAsync: PropTypes.func.isRequired,
};

HomeScreen.defaultProps = {
  errorMessage: "",
  fetching: false,
  commentsFetchDataByMessageId: {},
  graphDataFetchDataByMessageId: {},
};

export default HomeScreen;
