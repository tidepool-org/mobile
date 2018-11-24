import React, { PureComponent } from "react";
import { RefreshControl, StyleSheet } from "react-native";
import PropTypes from "prop-types";
import glamorous, { withTheme } from "glamorous-native";

import ProfileListItem from "./ProfileListItem";
import ErrorAlertManager from "../models/ErrorAlertManager";
import { UserPropType } from "../prop-types/user";
import { ProfileListItemPropType } from "../prop-types/profile";

class ProfileList extends PureComponent {
  constructor(props) {
    super(props);

    this.state = { refreshing: false };
  }

  componentDidMount() {
    const { errorMessage } = this.props;
    if (errorMessage) {
      ErrorAlertManager.show(errorMessage);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { errorMessage, fetching } = this.props;
    if (nextProps.errorMessage && !errorMessage) {
      ErrorAlertManager.show(nextProps.errorMessage);
    }

    if (!nextProps.fetching && fetching) {
      this.setState({ refreshing: false });
    }
  }

  onPress = profile => {
    const { onPress } = this.props;
    onPress(profile);
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
    <ProfileListItem key={item.userId} item={item} onPress={this.onPress} />
  );

  render() {
    const { profileListData } = this.props;
    const { refreshing } = this.state;

    return (
      <glamorous.FlatList
        backgroundColor="white"
        data={profileListData}
        extraData={this.state}
        keyExtractor={this.keyExtractor}
        renderItem={this.renderItem}
        ItemSeparatorComponent={this.renderSeparator}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={this.onRefresh} />
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
