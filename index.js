import { registerRootComponent } from "expo";
import React, { PureComponent } from "react";
import { Text, View } from "react-native";

class App extends PureComponent {
  render() {
    return (
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          margin: 5,
          flex: 1,
        }}
      >
        <Text>
          You probably to run "yarn run pre" or "yarn run prestorybook" after a
          clean "yarn install"!
        </Text>
      </View>
    );
    return null;
  }
}

registerRootComponent(App);