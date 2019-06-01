import React, { PureComponent } from "react";

import PropTypes from "prop-types";
import {
  Animated,
  LayoutAnimation,
  Linking,
  ViewPropTypes,
} from "react-native";
import { LinearGradient } from "expo";
import glamorous, { withTheme } from "glamorous-native";
import addHours from "date-fns/add_hours";
import subHours from "date-fns/sub_hours";

import Urls from "../constants/Urls";
import {
  makeYAxisLabelValues,
  makeYAxisBGBoundaryValues,
} from "./Graph/helpers";
import Graph from "./Graph/Graph";
import HashtagText from "./HashtagText";
import AddCommentButton from "./AddCommentButton";
import NotesListItemComment from "./NotesListItemComment";
import SignificantTimeChangeNotification from "../models/SignificantTimeChangeNotification";
import ConnectionStatus from "../models/ConnectionStatus";
import ErrorAlertManager from "../models/ErrorAlertManager";
import Metrics from "../models/Metrics";
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
  constructor(props) {
    super(props);

    this.state = {
      expanded: false,
      fadeAnimation: new Animated.Value(0),
      formattedTimestamp: formatDateForNoteList(props.note.timestamp),
    };
  }

  componentDidMount() {
    const { fadeAnimation } = this.state;
    const {
      commentsFetchData: { errorMessage: commentsFetchErrorMessage },
      graphDataFetchData: { errorMessage: graphDataFetchErrorMessage },
      note: { initiallyExpanded },
    } = this.props;

    Animated.timing(fadeAnimation, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    }).start();

    if (initiallyExpanded) {
      setTimeout(() => {
        this.toggleNote({ animationDuration: 350 });
      }, 100);
    }

    if (commentsFetchErrorMessage) {
      ErrorAlertManager.show(commentsFetchErrorMessage);
    }

    if (graphDataFetchErrorMessage) {
      ErrorAlertManager.show(graphDataFetchErrorMessage);
    }

    SignificantTimeChangeNotification.subscribe(this.timeChanged);
  }

  componentWillReceiveProps(nextProps) {
    const {
      commentsFetchData: { comments, errorMessage: commentsFetchErrorMessage },
      graphDataFetchData: { errorMessage: graphDataFetchErrorMessage },
      note: { timestamp },
    } = this.props;
    const { note: nextNote } = nextProps;

    if (nextNote.timestamp !== timestamp) {
      this.setState({
        formattedTimestamp: formatDateForNoteList(nextNote.timestamp),
      });
    }

    const shouldShowCommentsFetchErrorMessage =
      nextProps.commentsFetchData.errorMessage && !commentsFetchErrorMessage;
    const shouldShowGraphDataFetchErrorMessage =
      nextProps.graphDataFetchData.errorMessage && !graphDataFetchErrorMessage;
    if (
      shouldShowCommentsFetchErrorMessage ||
      shouldShowGraphDataFetchErrorMessage
    ) {
      ErrorAlertManager.show(
        nextProps.commentsFetchData.errorMessage ||
          nextProps.graphDataFetchData.errorMessage
      );
    }
    if (
      nextProps.commentsFetchData.comments.length > 0 &&
      comments.length === 0
    ) {
      LayoutAnimation.configureNext({
        ...LayoutAnimation.Presets.easeInEaseOut,
        duration: 175,
        useNativeDriver: true,
      });
    }

    const { toggleExpandedNotesCount } = this.props;
    const {
      toggleExpandedNotesCount: nextToggleExpandedNotesCount,
    } = nextProps;
    const { expanded } = this.state;
    const shouldToggleNote =
      expanded && toggleExpandedNotesCount !== nextToggleExpandedNotesCount;
    if (shouldToggleNote) {
      this.setState({ expanded: false }, () => {
        this.toggleNote({ animationDuration: 350, fetchComments: false });
      });
    }
  }

  componentWillUnmount() {
    SignificantTimeChangeNotification.unsubscribe(this.timeChanged);
  }

  onPressToggleNote = () => {
    const { expanded } = this.state;
    if (expanded) {
      Metrics.track({ metric: "Closed data viz" });
    } else {
      Metrics.track({ metric: "Opened data viz" });
    }
    this.toggleNote();
  };

  onPressDeleteNote = () => {
    const { note, onDeleteNotePressed } = this.props;
    onDeleteNotePressed({ note });
  };

  onPressEditNote = () => {
    const { note, navigateEditNote } = this.props;
    if (ConnectionStatus.isOffline()) {
      ErrorAlertManager.showOfflineNetworkError();
    } else {
      Metrics.track({ metric: "Clicked edit a note (Home screen)" });
      navigateEditNote({ note });
    }
  };

  onPressAddComment = () => {
    // TODO: If comments are still loading and user taps Add Comment, then the existing comments won't be shown on the Add Comment screen, even once commentsFetch has completed. We should probably fix that so that the while commentsFetch is in fetching state, and completes, while Add Comment screen is current, that it loads those comments? Should probably also have a comments loading indicator both in notes list and in Add Comment screen?
    const { note, navigateAddComment } = this.props;
    if (ConnectionStatus.isOffline()) {
      ErrorAlertManager.showOfflineNetworkError();
    } else {
      Metrics.track({ metric: "Clicked add comment" });
      navigateAddComment({ note });
    }
  };

  onPressDeleteComment = ({ note, comment }) => {
    const { onDeleteCommentPressed } = this.props;
    onDeleteCommentPressed({ note, comment });
  };

  onPressEditComment = ({ comment }) => {
    const { note, navigateEditComment } = this.props;
    if (ConnectionStatus.isOffline()) {
      ErrorAlertManager.showOfflineNetworkError();
    } else {
      Metrics.track({ metric: "Clicked edit comment" });
      navigateEditComment({
        note,
        comment,
      });
    }
  };

  timeChanged = () => {
    const { note } = this.props;

    this.setState({
      formattedTimestamp: formatDateForNoteList(note.timestamp),
    });
  };

  toggleNote = (
    { animationDuration = 175, fetchComments = true } = {
      animationDuration: 175,
      fetchComments: true,
    }
  ) => {
    const { allowExpansionToggle } = this.props;

    if (allowExpansionToggle) {
      const {
        note,
        currentProfile: { userId, lowBGBoundary, highBGBoundary },
        commentsFetchData: { fetching: isFetchingComments },
        graphDataFetchData: { fetching: isFetchingGraphData },
        commentsFetchAsync,
        graphDataFetchAsync,
      } = this.props;
      const { expanded: wasExpanded } = this.state;
      this.setState({ expanded: !wasExpanded });
      if (!wasExpanded) {
        if (fetchComments && !isFetchingComments) {
          commentsFetchAsync({ messageId: note.id });
        }
        if (!isFetchingGraphData) {
          const { timestamp } = note;
          const startDate = subHours(timestamp, 12);
          const endDate = addHours(timestamp, 12);
          const objectTypes = "smbg,bolus,cbg,wizard,basal,food";
          graphDataFetchAsync({
            messageId: note.id,
            userId,
            noteDate: timestamp,
            startDate,
            endDate,
            objectTypes,
            lowBGBoundary,
            highBGBoundary,
          });
        }
      }
      if (animationDuration) {
        LayoutAnimation.configureNext({
          ...LayoutAnimation.Presets.easeInEaseOut,
          duration: animationDuration,
          useNativeDriver: true,
        });
      }
    }
  };

  shouldRenderUserLabelSection() {
    const { note } = this.props;
    return note.userId !== note.groupId && note.userFullName;
  }

  static renderSeparator() {
    return (
      <LinearGradient
        colors={["#e4e4e5", "#ededee", "#f7f7f8"]}
        style={{ height: 10 }}
      />
    );
  }

  renderDeleteButton() {
    const { theme, note, currentUser, allowEditing } = this.props;
    const { expanded } = this.state;

    if (allowEditing && expanded) {
      const isNoteCreatedByCurrentUser = note.userId === currentUser.userId;
      const isNoteForCurrentUser = note.groupId === currentUser.userId;

      if (isNoteCreatedByCurrentUser || isNoteForCurrentUser) {
        return (
          <glamorous.TouchableOpacity
            marginLeft="auto"
            marginRight={10}
            marginTop={7}
            hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}
            onPress={this.onPressDeleteNote}
          >
            <glamorous.Text
              style={theme.editButtonTextStyle}
              allowFontScaling={false}
              numberOfLines={1}
            >
              Delete
            </glamorous.Text>
          </glamorous.TouchableOpacity>
        );
      }
    }
    return null;
  }

  renderEditButton() {
    const { theme, note, currentUser, allowEditing } = this.props;
    const { expanded } = this.state;

    if (allowEditing && expanded) {
      const isNoteCreatedByCurrentUser = note.userId === currentUser.userId;
      if (isNoteCreatedByCurrentUser) {
        return (
          <glamorous.TouchableOpacity
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
          {this.renderDeleteButton()}
          {this.renderEditButton()}
        </glamorous.View>
      );
    }

    return null;
  }

  renderDateSection() {
    const { theme } = this.props;
    const { formattedTimestamp } = this.state;

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
          {formattedTimestamp}
        </glamorous.Text>
        {!this.shouldRenderUserLabelSection() && this.renderDeleteButton()}
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

  renderGraph() {
    const { expanded } = this.state;

    if (expanded) {
      const {
        graphDataFetchData: {
          fetching,
          graphData: {
            cbgData,
            smbgData,
            basalData,
            maxBasalValue,
            bolusData,
            maxBolusValue,
            minBolusScaleValue,
            wizardData,
          },
        },
        currentProfile: { lowBGBoundary, highBGBoundary, units },
        note: { timestamp: eventTime },
      } = this.props;

      const isLoading = fetching;
      const yAxisLabelValues = makeYAxisLabelValues({
        lowBGBoundary,
        highBGBoundary,
      });
      const yAxisBGBoundaryValues = makeYAxisBGBoundaryValues({
        lowBGBoundary,
        highBGBoundary,
      });
      const navigateHowToUpload = () => {
        Linking.openURL(Urls.howToUpload);
      };

      const { onGraphZoomStart, onGraphZoomEnd, graphRenderer } = this.props;
      return (
        <Graph
          isLoading={isLoading}
          yAxisLabelValues={yAxisLabelValues}
          yAxisBGBoundaryValues={yAxisBGBoundaryValues}
          units={units}
          cbgData={cbgData}
          smbgData={smbgData}
          basalData={basalData}
          maxBasalValue={maxBasalValue}
          bolusData={bolusData}
          maxBolusValue={maxBolusValue}
          minBolusScaleValue={minBolusScaleValue}
          wizardData={wizardData}
          eventTime={eventTime}
          navigateHowToUpload={navigateHowToUpload}
          onZoomStart={onGraphZoomStart}
          onZoomEnd={onGraphZoomEnd}
          graphRenderer={graphRenderer}
        />
      );
    }

    return null;
  }

  renderComments() {
    const { currentUser, allowEditing, note } = this.props;
    const { expanded } = this.state;

    if (expanded) {
      const {
        theme,
        commentsFetchData: { comments },
      } = this.props;
      return comments.map(comment => {
        // Skip rendering the comment that has same id as the note
        if (comment.id !== note.id) {
          return (
            <NotesListItemComment
              key={comment.id}
              theme={theme}
              currentUserId={currentUser.userId}
              note={note}
              comment={comment}
              allowEditing={allowEditing}
              onPressEditComment={this.onPressEditComment}
              onPressDeleteComment={this.onPressDeleteComment}
            />
          );
        }
        return null;
      });
    }

    return null;
  }

  renderAddCommentButton() {
    const { allowEditing } = this.props;
    const { expanded } = this.state;

    if (allowEditing && expanded) {
      return <AddCommentButton onPress={this.onPressAddComment} />;
    }

    return null;
  }

  render() {
    const { style } = this.props;
    const { fadeAnimation } = this.state;

    return (
      <Animated.View
        style={[style, { backgroundColor: "white", opacity: fadeAnimation }]}
      >
        <glamorous.TouchableOpacity
          activeOpacity={1}
          onPress={this.onPressToggleNote}
        >
          {this.renderUserLabelSection()}
          {this.renderDateSection()}
          {this.renderNote()}
        </glamorous.TouchableOpacity>
        {this.renderGraph()}
        {this.renderComments()}
        {this.renderAddCommentButton()}
        {NotesListItem.renderSeparator()}
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
  toggleExpandedNotesCount: PropTypes.number,
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
  graphDataFetchAsync: PropTypes.func.isRequired,
  graphDataFetchData: PropTypes.shape({
    graphData: PropTypes.object,
    errorMessage: PropTypes.string,
    fetching: PropTypes.bool,
    fetched: PropTypes.bool,
  }),
  navigateEditNote: PropTypes.func.isRequired,
  onDeleteNotePressed: PropTypes.func.isRequired,
  navigateAddComment: PropTypes.func.isRequired,
  navigateEditComment: PropTypes.func.isRequired,
  onDeleteCommentPressed: PropTypes.func.isRequired,
  onGraphZoomStart: PropTypes.func.isRequired,
  onGraphZoomEnd: PropTypes.func.isRequired,
  graphRenderer: PropTypes.string.isRequired,
};

NotesListItem.defaultProps = {
  style: null,
  allowEditing: true,
  initiallyExpanded: false,
  allowExpansionToggle: true,
  toggleExpandedNotesCount: 0,
  commentsFetchData: {
    comments: [],
    errorMessage: "",
    fetching: false,
    fetched: false,
  },
  graphDataFetchData: {
    graphData: {},
    errorMessage: "",
    fetching: false,
    fetched: false,
  },
};

export default withTheme(NotesListItem);
