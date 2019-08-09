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
    backgroundColor: "#f9f9f9",
    borderColor: "#ededed",
    borderRadius: 4,
    borderWidth: 1,
    overflow: "hidden",
    height: 144,
    marginVertical: 8,
  },
  titleText: {
    color: "#4f6a92",
    fontSize: 16,
    lineHeight: 28,
    fontWeight: "500",
    marginTop: 8,
    marginLeft: 16,
  },
  bodyText: {
    color: "#7e98c3",
    fontSize: 12,
    lineHeight: 20,
    fontWeight: "500",
    marginHorizontal: 16,
    marginVertical: 8,
  },
  buttonDisabled: {
    elevation: 0,
    backgroundColor: "#9eaaf4",
  },
  textDisabled: {
    color: "white",
  },
});

class ButtonWithHeaderAndLongText extends PureComponent {
  render() {
    const {
      color,
      onPress,
      title,
      disabled,
      containerStyle,
      textStyle,
      bodyText,
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
            style={[mergedTextStyles, styles.titleText]}
            disabled={disabled}
            allowFontScaling={false}
          >
            {formattedTitle}
          </Text>
          <Text style={styles.bodyText}>{bodyText}</Text>
        </View>
      </Touchable>
    );
  }
}

ButtonWithHeaderAndLongText.propTypes = {
  title: PropTypes.string.isRequired,
  color: PropTypes.string,
  disabled: PropTypes.bool,
  onPress: PropTypes.func.isRequired,
  containerStyle: ViewPropTypes.style,
  textStyle: Text.propTypes.style,
  bodyText: PropTypes.string,
};

ButtonWithHeaderAndLongText.defaultProps = {
  color: null,
  disabled: false,
  containerStyle: null,
  textStyle: null,
  bodyText: null,
};

export default ButtonWithHeaderAndLongText;
