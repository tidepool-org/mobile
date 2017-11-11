import React from "react";
import { Image, TouchableOpacity } from "react-native";

class HeaderRight extends React.PureComponent {
  render() {
    return (
      <TouchableOpacity>
        <Image
          style={{ marginRight: 16 }}
          source={require("../../assets/images/add-button.png")}
        />
      </TouchableOpacity>
    );
  }
}

export default HeaderRight;
