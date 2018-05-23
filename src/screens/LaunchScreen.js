import React, { PureComponent } from "react";
import { StatusBar } from "react-native";
import glamorous from "glamorous-native";

class LaunchScreen extends PureComponent {
  render() {
    // console.log("LaunchScreen: render");

    return (
      <glamorous.View flex={1} backgroundColor="white">
        <StatusBar barStyle="dark-content" />
      </glamorous.View>
    );
  }
}

export default LaunchScreen;
