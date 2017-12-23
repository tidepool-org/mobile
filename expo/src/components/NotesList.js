import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Alert, RefreshControl } from "react-native";
import glamorous, { withTheme } from "glamorous-native";

import Colors from "../constants/Colors";
import NotesListItem from "./NotesListItem";

class NotesList extends PureComponent {
  static showErrorMessageAlert() {
    // TODO: strings - Use some i18n module for these and other UI strings
    Alert.alert(
      "Unknown Error Occurred",
      "An unknown error occurred. We are working hard to resolve this issue.",
      [{ text: "OK" }]
    );
  }

  state = { selected: new Map() };

  componentDidMount() {
    if (this.props.errorMessage) {
      NotesList.showErrorMessageAlert();
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.errorMessage && !this.props.errorMessage) {
      NotesList.showErrorMessageAlert();
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
    const { notesFetchAsync, userId } = this.props;

    notesFetchAsync({ userId });
  };

  keyExtractor = item => item.id;

  renderItem = ({ item }) => (
    <NotesListItem
      notes={item.notes}
      onPressItem={this.onPressItem}
      selected={!!this.state.selected.get(item.id)}
      timestampFormatted={item.timestampFormatted}
      messageText={item.messageText}
    />
  );

  render() {
    const { notes, fetching } = this.props;

    return (
      <glamorous.FlatList
        data={notes}
        extraData={this.state}
        keyExtractor={this.keyExtractor}
        renderItem={this.renderItem}
        backgroundColor={Colors.veryLightGrey} // TODO: use theme rather than color directly
        refreshControl={
          <RefreshControl refreshing={fetching} onRefresh={this.onRefresh} />
        }
      />
    );
  }
}

NotesList.propTypes = {
  notes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      timestampFormatted: PropTypes.string.isRequired,
      messageText: PropTypes.string.isRequired,
    })
  ).isRequired,
  errorMessage: PropTypes.string,
  fetching: PropTypes.bool,
  notesFetchAsync: PropTypes.func.isRequired,
  userId: PropTypes.string.isRequired,
};

NotesList.defaultProps = {
  errorMessage: "",
  fetching: false,
};

export default withTheme(NotesList);
