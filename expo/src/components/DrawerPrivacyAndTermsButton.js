import React, { Component } from "react";
import { Linking } from "react-native";

import Urls from "../constants/Urls";
import DrawerButton from "./DrawerButton";

class DrawerPrivacyAndTermsButton extends Component {
  onPress = () => {
    // TODO: metrics
    // console.log("privacy/tos button tapped");
    Linking.openURL(Urls.privacyAndTerms);
  };

  render() {
    return (
      <DrawerButton
        onPress={this.onPress}
        title="Privacy Policy and Terms of Use"
      />
    );
  }
}

export default DrawerPrivacyAndTermsButton;
