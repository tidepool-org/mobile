import React, { Component } from "react";
import PropTypes from "prop-types";

import DrawerButton from "./DrawerButton";

class DrawerSignOutButton extends Component {
  onPress = () => {
    this.props.navigation.dispatch({ type: "SignOut" });
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
    dispatch: PropTypes.func.isRequired,
  }).isRequired,
};

export default DrawerSignOutButton;
