import React from "react";
import PropTypes from "prop-types";
import { Platform, StyleSheet, TouchableNativeFeedback } from "react-native";
import glamorous, { withTheme } from "glamorous-native";

const styles = StyleSheet.create({
  button: {
    paddingLeft: 8,
    paddingRight: 8,
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

const Button = ({ title, color, disabled, onPress }) => {
  const buttonStyles = [styles.button];
  const textStyles = [styles.text];
  if (color) {
    buttonStyles.push({ backgroundColor: color });
  }
  const accessibilityTraits = ["button"];
  if (disabled) {
    buttonStyles.push(styles.buttonDisabled);
    textStyles.push(styles.textDisabled);
    accessibilityTraits.push("disabled");
  }
  const formattedTitle =
    Platform.OS === "android" ? title.toUpperCase() : title;
  const Touchable =
    Platform.OS === "android"
      ? TouchableNativeFeedback
      : glamorous.TouchableOpacity;
  return (
    <Touchable
      accessibilityComponentType="button"
      disabled={disabled}
      onPress={onPress}
    >
      <glamorous.View style={buttonStyles}>
        <glamorous.Text style={textStyles} disabled={disabled}>
          {formattedTitle}
        </glamorous.Text>
      </glamorous.View>
    </Touchable>
  );
};

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

export default withTheme(Button);
