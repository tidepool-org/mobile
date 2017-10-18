import React from "react";
import PropTypes from "prop-types";
import { RefreshControl } from "react-native";
import glamorous, { withTheme } from "glamorous-native";

import NoteListItem from "../NoteListItem";

class EventList extends React.PureComponent {
  state = { selected: new Map(), refreshing: false };

  onPressItem = id => {
    this.setState(state => {
      const selected = new Map(state.selected);
      selected.set(id, !selected.get(id));
      return { selected };
    });
  };

  onRefresh = () => {
    this.setState({
      refreshing: false,
    });
  };

  keyExtractor = item => item.id;

  renderItem = ({ item }) => (
    <NoteListItem
      id={item.id}
      onPressItem={this.onPressItem}
      selected={!!this.state.selected.get(item.id)}
      text={item.text}
    />
  );

  render() {
    return (
      <glamorous.FlatList
        data={this.props.data}
        extraData={this.state}
        keyExtractor={this.keyExtractor}
        renderItem={this.renderItem}
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

EventList.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

export default withTheme(EventList);
