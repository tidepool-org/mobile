import React from "react";

import PropTypes from "prop-types";
import glamorous, { withTheme } from "glamorous-native";

import ProfileListItem from "./ProfileListItem";

class ProfileList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { selected: new Map() };
  }

  onPress = userid => {
    this.props.onPress(userid);
  };

  keyExtractor = item => item.profile.userid;

  renderSeparator = () => (
    <glamorous.View height={1} marginLeft={8} backgroundColor="#CED0CE" />
  );

  renderItem = ({ item }) => (
    <ProfileListItem
      key={item.profile.userid}
      item={item}
      onPress={this.onPress}
      selected={!!this.state.selected.get(item.profile.userid)}
    />
  );

  render() {
    return (
      <glamorous.FlatList
        backgroundColor="white"
        data={this.props.items}
        extraData={this.state}
        keyExtractor={this.keyExtractor}
        renderItem={this.renderItem}
        ItemSeparatorComponent={this.renderSeparator}
      />
    );
  }
}

ProfileList.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      currentUserId: PropTypes.string.isRequired,
      selectedProfileUserId: PropTypes.string.isRequired,
      profile: PropTypes.shape({
        userid: PropTypes.string.isRequired,
      }).isRequired,
    }),
  ).isRequired,
  onPress: PropTypes.func.isRequired,
};

export default withTheme(ProfileList);
