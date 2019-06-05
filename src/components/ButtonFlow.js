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
    elevation: 4,
    backgroundColor: "#627cff",
    borderRadius: 3,
    overflow: "hidden",
    height: 44,
  },
  text: {
    color: "white",
    textAlign: "center",
    paddingTop: 15,
    fontWeight: "500",
    fontSize: 16,
    lineHeight: 14,
    letterSpacing: 0,
  },
  buttonDisabled: {
    elevation: 0,
    backgroundColor: "#9eaaf4",
  },
  textDisabled: {
    color: "white",
  },
  bottom: {
    flex: 1,
    justifyContent: "flex-end",
  },
});

class ButtonFlow extends PureComponent {
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
        <View style={styles.bottom}>
          <View style={mergedButtonStyles}>
            <Text
              style={mergedTextStyles}
              disabled={disabled}
              allowFontScaling={false}
            >
              {formattedTitle}
            </Text>
          </View>
        </View>
      </Touchable>
    );
  }
}

ButtonFlow.propTypes = {
  title: PropTypes.string.isRequired,
  color: PropTypes.string,
  disabled: PropTypes.bool,
  onPress: PropTypes.func.isRequired,
  containerStyle: ViewPropTypes.style,
  textStyle: Text.propTypes.style,
};

ButtonFlow.defaultProps = {
  color: null,
  disabled: false,
  containerStyle: null,
  textStyle: null,
};

export default ButtonFlow;
