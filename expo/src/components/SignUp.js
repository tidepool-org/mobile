import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { ViewPropTypes } from "react-native";
import glamorous, { withTheme } from "glamorous-native";

import ThemePropTypes from "../themes/ThemePropTypes";

class SignUp extends PureComponent {
  onPressSignUp = () => {
    this.props.navigation.dispatch({ type: "SignUp" });
  };

  render() {
    const { theme, style } = this.props;

    return (
      <glamorous.View style={style}>
        <glamorous.TouchableOpacity
          flexDirection="row"
          alignItems="center"
          onPress={this.onPressSignUp}
          padding={8}
        >
          <glamorous.Image
            source={require("../../assets/images/signup-plus.png")}
            width={20}
            height={20}
            marginRight={10}
          />
          <glamorous.Text
            allowFontScaling={false}
            style={theme.signUpTextStyle}
          >
            Sign up
          </glamorous.Text>
        </glamorous.TouchableOpacity>
      </glamorous.View>
    );
  }
}

SignUp.propTypes = {
  theme: ThemePropTypes.isRequired,
  style: ViewPropTypes.style,
  navigation: PropTypes.shape({
    dispatch: PropTypes.func.isRequired,
  }).isRequired,
};

SignUp.defaultProps = {
  style: null,
};

export default withTheme(SignUp);
