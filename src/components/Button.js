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

class Button extends PureComponent {
  render() {
    const {
      color,
      onPress,
      title,
      disabled,
      containerStyle,
      textStyle,
    } = this.props;
    const mergedButtonStyles = [styles.button, containerStyle];
    const mergedTextStyles = [styles.text];
    if (color) {
      if (Platform.OS === "ios") {
        mergedTextStyles.push({ color });
      } else {
        mergedButtonStyles.push({ backgroundColor: color });
      }
    }
    mergedTextStyles.push(textStyle);
    const accessibilityTraits = ["button"];
    if (disabled) {
      mergedButtonStyles.push(styles.buttonDisabled);
      mergedTextStyles.push(styles.textDisabled);
      accessibilityTraits.push("disabled");
    }
    const formattedTitle =
      Platform.OS === "android" ? title.toUpperCase() : title;
    // TODO: android - Revisit this. Do we want native feedback for Android? Or consistency/parity between iOS and Android
    const Touchable =
      Platform.OS === "android" ? TouchableNativeFeedback : TouchableOpacity;
    return (
      <Touchable
        accessibilityComponentType="button"
        disabled={disabled}
        onPress={onPress}
      >
        <View style={mergedButtonStyles}>
          <Text
            style={mergedTextStyles}
            disabled={disabled}
            allowFontScaling={false}
          >
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
  containerStyle: ViewPropTypes.style,
  textStyle: Text.propTypes.style,
};

Button.defaultProps = {
  color: null,
  disabled: false,
  containerStyle: null,
  textStyle: null,
};

export default Button;
