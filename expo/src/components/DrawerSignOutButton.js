import React, { Component } from "react";
import PropTypes from "prop-types";
import { NavigationActions } from "react-navigation";

import DrawerButton from "./DrawerButton";

class DrawerSignOutButton extends Component {
  onPress = () => {
    this.props.navigation.dispatch(
      NavigationActions.reset({
        index: 0,
        key: null,
        actions: [NavigationActions.navigate({ routeName: "SignIn" })],
      }),
    );
  };

  render() {
    const { currentUser } = this.props;

    return (
      <DrawerButton
        onPress={this.onPress}
        title="Log out"
        subtitle={currentUser.username}
      />
    );
  }
}

DrawerSignOutButton.propTypes = {
  currentUser: PropTypes.shape({
    username: PropTypes.string.isRequired,
  }).isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
  }).isRequired,
};

export default DrawerSignOutButton;
