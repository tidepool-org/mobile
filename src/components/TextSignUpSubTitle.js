import React, { PureComponent } from "react";
import {
  StyleSheet,
  View,
  Text,
} from "react-native";
import PropTypes from "prop-types";

const styles = StyleSheet.create({
  subTitleText: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    color: "#7e98c3",
    marginBottom: 26,
    fontWeight: "500",
  },
});

class TextSignUpSubTitle extends PureComponent {
  render() {
    const {
      title,
    } = this.props;

    return (
      <View>
        <Text style={styles.subTitleText}>{title}</Text>
      </View>
    );
  }
}

TextSignUpSubTitle.propTypes = {
  title: PropTypes.string.isRequired,
};

export default TextSignUpSubTitle;
