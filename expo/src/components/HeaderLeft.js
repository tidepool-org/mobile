import React from "react";
import PropTypes from "prop-types";
import { Image, TouchableOpacity } from "react-native";

class HeaderLeft extends React.Component {
  onPressMenu = () => {
    this.props.navigation.dispatch({ type: "DrawerOpen" });
  };

  render() {
    return (
      <TouchableOpacity
        style={{
          padding: 10,
          marginLeft: 6,
        }}
        onPress={this.onPressMenu}
      >
        <Image
          tintColor="white"
          source={require("../../assets/images/menu-button.png")}
        />
      </TouchableOpacity>
    );
  }
}

HeaderLeft.propTypes = {
  navigation: PropTypes.shape({
    dispatch: PropTypes.func.isRequired,
  }).isRequired,
};

export default HeaderLeft;
