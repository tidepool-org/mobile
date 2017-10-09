import React from "react";
import { View } from "react-native";
import glamorous, { withTheme } from "glamorous-native";

import ThemePropTypes from "../../themes/ThemePropTypes";

const SignUp = ({ theme, style }) => (
  <glamorous.View style={style}>
    <glamorous.TouchableOpacity
      flexDirection="row"
      justifyContent="flex-end"
      alignItems="center"
      padding={8}
    >
      <glamorous.Image
        source={require("../../../assets/images/signup-plus.png")}
        width={20}
        height={20}
        marginRight={10}
      />
      <glamorous.Text style={theme.signUpTextStyle}>Sign up</glamorous.Text>
    </glamorous.TouchableOpacity>
  </glamorous.View>
);

SignUp.propTypes = {
  theme: ThemePropTypes.isRequired,
  style: View.propTypes.style,
};

SignUp.defaultProps = {
  style: null,
};

export default withTheme(SignUp);
