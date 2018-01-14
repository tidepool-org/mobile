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
      selected: new Map(),
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

  onPressItem = id => {
    this.setState(state => {
      const selected = new Map(state.selected);
      selected.set(id, !selected.get(id));
      return { selected };
    });
  };

  onRefresh = () => {
    const { notesFetchAsync, currentProfile } = this.props;

    this.setState({ refreshing: true });

    notesFetchAsync({ profile: currentProfile });
  };

  keyExtractor = item => item.id;

  renderItem = ({ item }) => (
    <NotesListItem
      onPressItem={this.onPressItem}
      selected={!!this.state.selected.get(item.id)}
      note={item}
      currentUser={this.props.currentUser}
      currentProfile={this.props.currentProfile}
      commentsFetchData={this.props.commentsFetchDataByMessageId[item.id]}
      commentsFetchAsync={this.props.commentsFetchAsync}
      navigateEditNote={this.props.navigateEditNote}
    />
  );

  render() {
    const { notes } = this.props;

    return (
      <glamorous.FlatList
        data={notes}
        extraData={this.state}
        keyExtractor={this.keyExtractor}
        renderItem={this.renderItem}
        backgroundColor={Colors.veryLightGrey} // TODO: use theme rather than color directly
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
      errorMessage: PropTypes.string,
      fetching: PropTypes.bool,
      comments: PropTypes.arrayOf(CommentPropType),
    })
  ),
  navigateEditNote: PropTypes.func.isRequired,
};

NotesList.defaultProps = {
  errorMessage: "",
  fetching: false,
  commentsFetchDataByMessageId: {},
};

export default withTheme(NotesList);
