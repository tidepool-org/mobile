import React, { PureComponent } from "react";
import {
  StyleSheet,
  View,
  Text,
} from "react-native";
import PropTypes from "prop-types";

const styles = StyleSheet.create({
  midTitleText: {
    fontSize: 20,
    textAlign: "center",
    lineHeight: 32,
    color: "#4f6a92",
    marginTop: 17,
    marginBottom: 14,
    fontWeight: "bold",
  },
});

class TextSignUpMidTitle extends PureComponent {
  render() {
    const {
      title,
    } = this.props;

    return (
      <View>
        <Text style={styles.midTitleText}>{title}</Text>
      </View>
    );
  }
}

TextSignUpMidTitle.propTypes = {
  title: PropTypes.string.isRequired,
};

export { TextSignUpMidTitle };
