import React, { PureComponent } from "react";
import {
  StyleSheet,
  View,
  Text,
} from "react-native";
import PropTypes from "prop-types";

const styles = StyleSheet.create({
  titleText: {
    fontSize: 24,
    textAlign: "center",
    lineHeight: 32,
    color: "#4f6a92",
    marginTop: 17,
    marginBottom: 14,
    fontWeight: "bold",
  },
});

class TextSignUpTitle extends PureComponent {
  render() {
    const {
      title,
    } = this.props;

    return (
      <View>
        <Text style={styles.titleText}>{title}</Text>
      </View>
    );
  }
}

TextSignUpTitle.propTypes = {
  title: PropTypes.string.isRequired,
};

export { TextSignUpTitle };
