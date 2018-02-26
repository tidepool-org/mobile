import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { StatusBar } from "react-native";
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

  render() {
    const {
      currentUser,
      commentsFetchDataByMessageId,
      commentsFetchAsync,
      currentProfile,
      errorMessage,
      fetching,
      notes,
      notesFetchAsync,
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
            commentsFetchAsync={commentsFetchAsync}
            commentsFetchDataByMessageId={commentsFetchDataByMessageId}
            navigateEditNote={navigateEditNote}
            navigateAddComment={navigateAddComment}
            navigateEditComment={navigateEditComment}
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
  navigateAddComment: PropTypes.func.isRequired,
  navigateEditComment: PropTypes.func.isRequired,
};

HomeScreen.defaultProps = {
  errorMessage: "",
  fetching: false,
  commentsFetchDataByMessageId: {},
};

export default HomeScreen;
