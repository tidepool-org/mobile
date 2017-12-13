import React from "react";
import PropTypes from "prop-types";
import { Image, TouchableOpacity } from "react-native";

class HeaderLeft extends React.Component {
  onPress = () => {
    this.props.navigateDrawerOpen();
  };

  render() {
    return (
      <TouchableOpacity
        style={{
          padding: 10,
          marginLeft: 6,
        }}
        onPress={this.onPress}
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
  navigateDrawerOpen: PropTypes.func.isRequired,
};

export default HeaderLeft;
