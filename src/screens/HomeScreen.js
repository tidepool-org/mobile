import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Alert, StatusBar } from "react-native";
import glamorous, { ThemeProvider } from "glamorous-native";
import * as MailComposer from 'expo-mail-composer';

import PrimaryTheme from "../themes/PrimaryTheme";
import Colors from "../constants/Colors";
import HomeScreenHeaderTitleContainer from "../containers/HomeScreenHeaderTitleContainer";
import HomeScreenHeaderLeftContainer from "../containers/HomeScreenHeaderLeftContainer";
import HomeScreenHeaderRightContainer from "../containers/HomeScreenHeaderRightContainer";
import NotesList from "../components/NotesList";
import Tooltip from "../components/Tooltip";
import TidepoolUploaderTooltipContent from "../components/Tooltips/TidepoolUploaderTooltipContent";
import FirstTimeTips from "../models/FirstTimeTips";
import AlertManager from "../models/AlertManager";
import { ProfilePropType } from "../prop-types/profile";
import { CommentPropType } from "../prop-types/comment";
import { UserPropType } from "../prop-types/user";
import Metrics from "../models/Metrics";

class HomeScreen extends PureComponent {
  constructor(props) {
    super(props);

    this.theme = PrimaryTheme;
    this.state = {
      toolTipVisible: false,
    };
  }

  componentDidMount() {
    const { currentProfile, notesFetchAsync } = this.props;
    Metrics.track({ metric: "Viewed Home Screen (Home Screen)" });
    notesFetchAsync({
      profile: currentProfile,
    });
  }

  componentDidUpdate() {
    const { navigation, notesFetch, currentUser } = this.props;
    this.showTipIfNeeded({ navigation, notesFetch, currentUser });
  }

  componentWillUnmount() {
    if (this.showTipTimeoutId) {
      clearTimeout(this.showTipTimeoutId);
    }
  }

  onDeleteNotePressed = ({ note }) => {
    const { noteDeleteAsync, currentProfile, isOffline } = this.props;

    if (isOffline) {
      AlertManager.showOfflineMessage(
        "It seems you’re offline, so you can't delete notes."
      );
    } else {
      AlertManager.showCancelOrDestructiveAlert({
        title: AlertManager.alertTitleDelete,
        message: "Once you delete this note, it cannot be recovered.",
        destructiveButtonText: AlertManager.alertButtonTextDelete,
        onPress: () => noteDeleteAsync({ currentProfile, note }),
      });
    }
  };

  onDeleteCommentPressed = ({ note, comment }) => {
    const { commentDeleteAsync, currentProfile, isOffline } = this.props;

    if (isOffline) {
      AlertManager.showOfflineMessage(
        "It seems you’re offline, so you can't delete comments."
      );
    } else {
      AlertManager.showCancelOrDestructiveAlert({
        title: AlertManager.alertTitleDelete,
        message: "Once you delete this comment, it cannot be recovered.",
        destructiveButtonText: AlertManager.alertButtonTextDelete,
        onPress: () => commentDeleteAsync({ note, currentProfile, comment }),
      });
    }
  };

  onPressTooltipEmailLink = () => {
    Metrics.track({ metric: "Clicked email a link" });
    this.composeEmailWithDesktopUploaderLink();
    this.hideTipIfNeeded();
  };

  onPressTooltipOk = () => {
    Metrics.track({ metric: "Clicked first time need uploader" });
    this.hideTipIfNeeded();
  };

  async composeEmailWithDesktopUploaderLink() {
    const { currentUser } = this.props;
    const currentUserEmail = currentUser.username;

    try {
      await MailComposer.composeAsync({
        subject: "How to set up the Tidepool Uploader",
        body:
          "Please go to the following link on your computer to learn about setting up the Tidepool Uploader: https://support.tidepool.org/hc/en-us/articles/360019872871-How-to-use-the-Tidepool-Uploader",

        recipients: [currentUserEmail],
      });
    } catch (error) {
      Alert.alert(
        "Error",
        "Unable to send email. You may need to configure email settings on your device.",
        [{ text: "OK" }]
      );
    }
  }

  showTipIfNeeded(params) {
    if (
      FirstTimeTips.shouldShowTip(
        FirstTimeTips.TIP_GET_DESKTOP_UPLOADER,
        params
      )
    ) {
      const { firstTimeTipsShowTip } = this.props;
      this.showTipTimeoutId = setTimeout(() => {
        firstTimeTipsShowTip(FirstTimeTips.TIP_GET_DESKTOP_UPLOADER, true);
        this.setState({ toolTipVisible: true });
      }, 50);
    }
  }

  hideTipIfNeeded() {
    if (FirstTimeTips.currentTip === FirstTimeTips.TIP_GET_DESKTOP_UPLOADER) {
      const { firstTimeTipsShowTip } = this.props;
      firstTimeTipsShowTip(FirstTimeTips.TIP_GET_DESKTOP_UPLOADER, false);
      this.setState({ toolTipVisible: false });
    }
  }

  render() {
    const {
      isOffline,
      currentUser,
      commentsFetchAsync,
      commentsFetchDataByMessageId,
      graphDataFetchAsync,
      graphDataFetchDataByMessageId,
      graphRenderer,
      currentProfile,
      notesFetch: {
        errorMessage,
        fetching,
        notes,
        searchText,
        toggleExpandedNotesCount,
      },
      notesFetchAsync,
      notesFetchSetSearchFilter,
      navigateEditNote,
      navigateAddComment,
      navigateEditComment,
    } = this.props;
    const { toolTipVisible } = this.state;

    return (
      <ThemeProvider theme={this.theme}>
        <glamorous.View flex={1}>
          <StatusBar barStyle="light-content" />
          <NotesList
            currentUser={currentUser}
            notes={notes}
            toggleExpandedNotesCount={toggleExpandedNotesCount}
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
            isOffline={isOffline}
          />
          <Tooltip
            isVisible={toolTipVisible}
            placement="top"
            content={(
              <TidepoolUploaderTooltipContent
                onPressEmailLink={this.onPressTooltipEmailLink}
                onPressOk={this.onPressTooltipOk}
              />
)}
            arrowSize={{ width: 0, height: 0 }}
            tooltipOriginOffset={{
              x: 0,
              y: -24,
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
  notesFetch: PropTypes.object.isRequired,
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
  navigation: PropTypes.object.isRequired,
  firstTimeTipsShowTip: PropTypes.func.isRequired,
  isOffline: PropTypes.bool,
};

HomeScreen.defaultProps = {
  commentsFetchDataByMessageId: {},
  graphDataFetchDataByMessageId: {},
  isOffline: false,
};

HomeScreen.navigationOptions = () => {
  const headerStyle = { backgroundColor: Colors.darkPurple };

  return {
    headerStyle,
    headerTitle: <HomeScreenHeaderTitleContainer />,
    headerLeft: <HomeScreenHeaderLeftContainer />,
    headerRight: <HomeScreenHeaderRightContainer />,
  };
};

export default HomeScreen;
