import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { ViewPropTypes } from "react-native";
import glamorous, { withTheme } from "glamorous-native";

import { ThemePropType } from "../prop-types/theme";

class SignUp extends PureComponent {
  onPressSignUp = () => {
    const { navigateSignUp } = this.props;

    navigateSignUp();
  };

  render() {
    const { theme, style } = this.props;

    return (
      <glamorous.View style={style}>
        <glamorous.TouchableOpacity
          flexDirection="row"
          alignItems="center"
          onPress={this.onPressSignUp}
          hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}
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
  theme: ThemePropType.isRequired,
  style: ViewPropTypes.style,
  navigateSignUp: PropTypes.func.isRequired,
};

SignUp.defaultProps = {
  style: null,
};

export default withTheme(SignUp);
