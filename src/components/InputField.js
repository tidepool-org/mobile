import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import {
  Platform,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TouchableNativeFeedback,
  ViewPropTypes,
  Keyboard,
  ActivityIndicator,
} from "react-native";

import glamorous, { withTheme } from "glamorous-native";

import { ThemePropType } from "../prop-types/theme";

const styles = StyleSheet.create({
  text: {
    color: "white",
    textAlign: "center",
    padding: 8,
    fontWeight: "500",
  },
});

class InputField extends PureComponent {
  render() {
    return (
      <glamorous.TextInput
        allowFontScaling={false}
        returnKeyType="next"
        selectionColor="#657ef6"
        underlineColorAndroid="#657ef6"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        placeholder="Email"
        borderColor="#e2e3e4"
        height={47.5}
        borderWidth={Platform.OS === "android" ? 0 : 1}
        paddingLeft={Platform.OS === "android" ? 3 : 12}

      />

    );
  }
}


export default InputField;
