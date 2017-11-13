import React from "react";
import PropTypes from "prop-types";
import { Platform, Image, StatusBar, TouchableOpacity } from "react-native";

class HeaderLeft extends React.Component {
  onPressMenu = () => {
    this.props.navigation.navigate("DrawerOpen");
  };

  render() {
    return (
      <TouchableOpacity
        style={{
          padding: 10,
          marginLeft: 6,
          marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
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
    navigate: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
  }).isRequired,
};

export default HeaderLeft;
