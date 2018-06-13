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
import Tooltip from "../components/Tooltip";
import TidepoolUploaderTooltipContent from "../components/Tooltips/TidepoolUploaderTooltipContent";
import { ProfilePropType } from "../prop-types/profile";
import { CommentPropType } from "../prop-types/comment";
import { UserPropType } from "../prop-types/user";

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

  state = {
    toolTipVisible: false,
  };

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

  onPressTooltipEmailLink = () => {
    // TODO: Handle email link
    this.setState({ toolTipVisible: false });
  };

  onPressTooltipOk = () => {
    this.setState({ toolTipVisible: false });
  };

  theme = PrimaryTheme;

  render() {
    const {
      currentUser,
      commentsFetchAsync,
      commentsFetchDataByMessageId,
      graphDataFetchAsync,
      graphDataFetchDataByMessageId,
      graphRenderer,
      currentProfile,
      errorMessage,
      fetching,
      notes,
      searchText,
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
            searchText={searchText}
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
            graphRenderer={graphRenderer}
          />
          <Tooltip
            isVisible={this.state.toolTipVisible}
            placement="top"
            content={
              <TidepoolUploaderTooltipContent
                onPressEmailLink={this.onPressTooltipEmailLink}
                onPressOk={this.onPressTooltipOk}
              />
            }
            arrowSize={{ width: 0, height: 0 }}
            adjustPlacementStyle={placementStyle => {
              const { top, ...rest } = placementStyle;
              return {
                ...rest,
                top: top - 5,
              };
            }}
          >
            <glamorous.View
              position="absolute"
              right={0}
              left={0}
              bottom={0}
              justifyContent="center"
              flexDirection="row"
            >
              <glamorous.View
                backgroundColor="transparent"
                width={0}
                height={0}
              />
            </glamorous.View>
          </Tooltip>
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
  searchText: PropTypes.string,
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
  graphRenderer: PropTypes.string.isRequired,
  navigateEditNote: PropTypes.func.isRequired,
  navigateAddComment: PropTypes.func.isRequired,
  navigateEditComment: PropTypes.func.isRequired,
  noteDeleteAsync: PropTypes.func.isRequired,
  commentDeleteAsync: PropTypes.func.isRequired,
};

HomeScreen.defaultProps = {
  errorMessage: "",
  searchText: "",
  fetching: false,
  commentsFetchDataByMessageId: {},
  graphDataFetchDataByMessageId: {},
};

export default HomeScreen;
