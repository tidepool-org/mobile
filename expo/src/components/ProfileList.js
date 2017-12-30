import React, { PureComponent } from "react";
import { Alert, RefreshControl, StyleSheet } from "react-native";
import PropTypes from "prop-types";
import glamorous, { withTheme } from "glamorous-native";

import ProfileListItem from "./ProfileListItem";
import { UserPropType } from "../prop-types/user";
import { ProfileListItemPropType } from "../prop-types/profile";

class ProfileList extends PureComponent {
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

    this.state = { selected: new Map(), refreshing: false };
  }

  componentDidMount() {
    if (this.props.errorMessage) {
      ProfileList.showErrorMessageAlert();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errorMessage && !this.props.errorMessage) {
      ProfileList.showErrorMessageAlert();
    }

    if (!nextProps.fetching && this.props.fetching) {
      this.setState({ refreshing: false });
    }
  }

  onPress = profile => {
    this.props.onPress(profile);
  };

  onRefresh = () => {
    const { profilesFetchAsync, user } = this.props;

    this.setState({ refreshing: true });

    profilesFetchAsync({ ...user });
  };

  keyExtractor = item => item.userId;

  renderSeparator = () => (
    <glamorous.View
      height={StyleSheet.hairlineWidth}
      marginLeft={8}
      backgroundColor="#CED0CE"
    />
  );

  renderItem = ({ item }) => (
    <ProfileListItem
      key={item.userId}
      item={item}
      onPress={this.onPress}
      selected={!!this.state.selected.get(item.userId)}
    />
  );

  render() {
    const { profileListData } = this.props;

    return (
      <glamorous.FlatList
        backgroundColor="white"
        data={profileListData}
        extraData={this.state}
        keyExtractor={this.keyExtractor}
        renderItem={this.renderItem}
        ItemSeparatorComponent={this.renderSeparator}
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

ProfileList.propTypes = {
  profileListData: PropTypes.arrayOf(ProfileListItemPropType).isRequired,
  onPress: PropTypes.func.isRequired,
  profilesFetchAsync: PropTypes.func.isRequired,
  errorMessage: PropTypes.string,
  fetching: PropTypes.bool,
  user: UserPropType.isRequired,
};

ProfileList.defaultProps = {
  errorMessage: "",
  fetching: false,
};

export default withTheme(ProfileList);
