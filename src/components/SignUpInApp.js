import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { ViewPropTypes } from "react-native";
import glamorous, { withTheme } from "glamorous-native";

import { ThemePropType } from "../prop-types/theme";

class SignUpInApp extends PureComponent {

  onPressSignUpInApp = () => {
    const { navigateSignUpInApp } = this.props;

    navigateSignUpInApp();
  }

  render() {
    const { theme, style } = this.props;

    return (
      <glamorous.View style={style}>
        <glamorous.TouchableOpacity
          flexDirection="row"
          alignItems="center"
          onPress={this.onPressSignUpInApp}
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
            In App Sign Up
          </glamorous.Text>
        </glamorous.TouchableOpacity>
      </glamorous.View>
    );
  }
}

SignUpInApp.propTypes = {
  theme: ThemePropType.isRequired,
  style: ViewPropTypes.style,
  navigateSignUpInApp: PropTypes.func.isRequired,
};

SignUpInApp.defaultProps = {
  style: null,
};

export default withTheme(SignUpInApp);
