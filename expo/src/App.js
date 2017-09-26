import React from "react";
import { StyleSheet, View, Image } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

const App = () => (
  <View style={styles.container}>
    <Image source={require("../assets/images/Tidepool_Logo_Light.png")} />
  </View>
);

export default App;
