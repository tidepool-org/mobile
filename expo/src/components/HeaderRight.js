import React from "react";
import { Platform, Image, StatusBar, TouchableOpacity } from "react-native";

class HeaderRight extends React.PureComponent {
  render() {
    return (
      <TouchableOpacity
        style={{
          padding: 10,
          marginRight: 6,
          marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        }}
      >
        <Image source={require("../../assets/images/add-button.png")} />
      </TouchableOpacity>
    );
  }
}

export default HeaderRight;
