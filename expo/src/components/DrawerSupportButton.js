import React, { Component } from "react";
import { Linking } from "react-native";

import Urls from "../constants/Urls";
import DrawerButton from "./DrawerButton";

class DrawerSupportButton extends Component {
  onPress = () => {
    // TODO: metrics
    // console.log("support button tapped");
    Linking.openURL(Urls.support);
  };

  render() {
    return <DrawerButton onPress={this.onPress} title="Tidepool Support" />;
  }
}

export default DrawerSupportButton;
