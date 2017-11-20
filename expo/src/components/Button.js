import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  Platform,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from "react-native";

const styles = StyleSheet.create({
  button: {
    paddingLeft: 16,
    paddingRight: 16,
    elevation: 4,
    backgroundColor: "#627cff",
    borderRadius: 3,
    overflow: "hidden",
  },
  text: {
    color: "white",
    textAlign: "center",
    padding: 8,
    fontWeight: "500",
  },
  buttonDisabled: {
    elevation: 0,
    backgroundColor: "#9eaaf4",
  },
  textDisabled: {
    color: "white",
  },
});

class Button extends Component {
  render() {
    const { color, onPress, title, disabled } = this.props;
    const buttonStyles = [styles.button];
    const textStyles = [styles.text];
    if (color) {
      if (Platform.OS === "ios") {
        textStyles.push({ color });
      } else {
        buttonStyles.push({ backgroundColor: color });
      }
    }
    const accessibilityTraits = ["button"];
    if (disabled) {
      buttonStyles.push(styles.buttonDisabled);
      textStyles.push(styles.textDisabled);
      accessibilityTraits.push("disabled");
    }
    const formattedTitle =
      Platform.OS === "android" ? title.toUpperCase() : title;
    const Touchable = TouchableOpacity;
    // TODO: Revisit this. Do we want native feedback for Android? Or consistency/parity between iOS and Android
    // const Touchable =
    //   Platform.OS === "android" ? TouchableNativeFeedback : TouchableOpacity;
    return (
      <Touchable
        accessibilityComponentType="button"
        disabled={disabled}
        onPress={onPress}
      >
        <View style={buttonStyles}>
          <Text style={textStyles} disabled={disabled}>
            {formattedTitle}
          </Text>
        </View>
      </Touchable>
    );
  }
}

Button.propTypes = {
  title: PropTypes.string.isRequired,
  color: PropTypes.string,
  disabled: PropTypes.bool,
  onPress: PropTypes.func.isRequired,
};

Button.defaultProps = {
  color: null,
  disabled: false,
};

export default Button;
