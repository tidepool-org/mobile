import React, { Component } from "react";
import glamorous from "glamorous-native";

class Divider extends Component {
  render() {
    return (
      <glamorous.View
        style={{
          flex: 1,
          height: 1,
          borderBottomColor: "#caccd0",
          borderBottomWidth: 1,
        }}
      />
    );
  }
}

export default Divider;
