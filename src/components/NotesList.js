import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import {
  Alert,
  Keyboard,
  LayoutAnimation,
  Platform,
  RefreshControl,
} from "react-native";
import glamorous, { withTheme } from "glamorous-native";

import Colors from "../constants/Colors";
import NotesListItem from "./NotesListItem";
import SearchBar from "./SearchBar";
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
      shouldShowSearchBar: true,
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

  onSearchBarLayout = ({ nativeEvent }) => {
    if (!this.searchBarHeight) {
      this.searchBarHeight = nativeEvent.layout.height;
    }
  };

  onScrollBeginDrag = ({ nativeEvent }) => {
    Keyboard.dismiss();
    const contentOffsetY = nativeEvent.contentOffset.y;
    this.lastContentOffsetY = contentOffsetY;
    this.isScrollInitiatedByUser = true;
  };

  onScrollEndDrag = ({ nativeEvent }) => {
    // FIXME: There's an odd issue on (some?) Android devices where the animation doesn't complete
    // and the SearchBar is only half-shown. Removing the animation fixes it. (useNativeDriver
    // makes no difference.) Additionally, though, while the user is still scrolling, if the search
    // bar hides or shows, it messes up the scroll interaction. iOS doesn't suffer from this. So,
    // for now, don't hide/show search bar for android during scrolling, just show it all the time
    if (Platform.OS === "ios") {
      const { targetContentOffset } = nativeEvent;
      if (
        targetContentOffset &&
        targetContentOffset.y < this.searchBarHeight / 2
      ) {
        LayoutAnimation.configureNext({
          ...LayoutAnimation.Presets.easeInEaseOut,
          duration: 250,
          useNativeDriver: true,
        });
        this.setState({ shouldShowSearchBar: true });
      }
    }

    this.isScrollInitiatedByUser = false;
  };

  onScroll = ({ nativeEvent }) => {
    const { notes } = this.props;
    // FIXME: There's an odd issue on (some?) Android devices where the animation doesn't complete
    // and the SearchBar is only half-shown. Removing the animation fixes it. (useNativeDriver
    // makes no difference.) Additionally, though, while the user is still scrolling, if the search
    // bar hides or shows, it messes up the scroll interaction. iOS doesn't suffer from this. So,
    // for now, don't hide/show search bar for android during scrolling, just show it all the time
    if (
      this.isScrollInitiatedByUser &&
      Platform.OS === "ios" &&
      notes.length > 0
    ) {
      const contentOffsetY = nativeEvent.contentOffset.y;
      const deltaY = contentOffsetY - this.lastContentOffsetY;
      const isScrollingDown = deltaY > 0;
      this.lastContentOffsetY = contentOffsetY;
      if (contentOffsetY > this.searchBarHeight) {
        if (isScrollingDown && deltaY > 5.0) {
          LayoutAnimation.configureNext({
            ...LayoutAnimation.Presets.easeInEaseOut,
            duration: 250,
            useNativeDriver: true,
          });
          this.setState({ shouldShowSearchBar: false });
        } else if (!isScrollingDown && deltaY < -5.0) {
          LayoutAnimation.configureNext({
            ...LayoutAnimation.Presets.easeInEaseOut,
            duration: 250,
            useNativeDriver: true,
          });
          this.setState({ shouldShowSearchBar: true });
        }
      } else if (contentOffsetY < this.searchBarHeight / 2) {
        LayoutAnimation.configureNext({
          ...LayoutAnimation.Presets.easeInEaseOut,
          duration: 250,
          useNativeDriver: true,
        });
        this.setState({ shouldShowSearchBar: true });
      }
    }
  };

  onChangeSearchText = text => {
    const searchText = text.trim();
    this.props.notesFetchSetSearchFilter({ searchText });
  };

  onGraphZoomStart = () => {
    // console.log("onGraphZoomStart");
    this.setState({ isZoomingGraph: true });
  };

  onGraphZoomEnd = () => {
    // console.log("onGraphZoomEnd");
    this.setState({ isZoomingGraph: false });
  };

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
      graphDataFetchData={this.props.graphDataFetchDataByMessageId[item.id]}
      graphDataFetchAsync={this.props.graphDataFetchAsync}
      navigateEditNote={this.props.navigateEditNote}
      onDeleteNotePressed={this.props.onDeleteNotePressed}
      navigateAddComment={this.props.navigateAddComment}
      navigateEditComment={this.props.navigateEditComment}
      onDeleteCommentPressed={this.props.onDeleteCommentPressed}
      onGraphZoomStart={this.onGraphZoomStart}
      onGraphZoomEnd={this.onGraphZoomEnd}
      graphRenderer={this.props.graphRenderer}
    />
  );

  render() {
    const { notes, searchText } = this.props;
    const { isZoomingGraph } = this.state;

    return (
      <glamorous.View flex={1}>
        <glamorous.View onLayout={this.onSearchBarLayout}>
          {this.state.shouldShowSearchBar && (
            <SearchBar
              searchText={searchText}
              onChangeText={this.onChangeSearchText}
            />
          )}
        </glamorous.View>
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
          scrollEnabled={!isZoomingGraph}
          scrollEventThrottle={Platform.OS === "ios" ? 16 : undefined}
          onScroll={Platform.OS === "ios" ? this.onScroll : undefined}
          onScrollBeginDrag={this.onScrollBeginDrag}
          onScrollEndDrag={this.onScrollEndDrag}
        />
      </glamorous.View>
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
  searchText: PropTypes.string,
  errorMessage: PropTypes.string,
  fetching: PropTypes.bool,
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
  onDeleteNotePressed: PropTypes.func.isRequired,
  navigateAddComment: PropTypes.func.isRequired,
  navigateEditComment: PropTypes.func.isRequired,
  onDeleteCommentPressed: PropTypes.func.isRequired,
};

NotesList.defaultProps = {
  errorMessage: "",
  searchText: "",
  fetching: false,
  commentsFetchDataByMessageId: {},
  graphDataFetchDataByMessageId: {},
};

export default withTheme(NotesList);