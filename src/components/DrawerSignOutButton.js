import React, { PureComponent } from "react";
import PropTypes from "prop-types";

import DrawerButton from "./DrawerButton";

class DrawerSignOutButton extends PureComponent {
  onPress = () => {
    const { authSignOutAsync } = this.props;
    authSignOutAsync();
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
  authSignOutAsync: PropTypes.func.isRequired,
};

export default DrawerSignOutButton;
