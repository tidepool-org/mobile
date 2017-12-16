import React, { PureComponent } from "react";
import { Image, TouchableOpacity } from "react-native";

class HeaderRight extends PureComponent {
  render() {
    return (
      <TouchableOpacity
        style={{
          padding: 10,
          marginRight: 6,
        }}
      >
        <Image source={require("../../assets/images/add-button.png")} />
      </TouchableOpacity>
    );
  }
}

export default HeaderRight;
