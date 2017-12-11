import React, { Component } from "react";
import PropTypes from "prop-types";
import { KeyboardAvoidingView, Platform, ViewPropTypes } from "react-native";
import glamorous, { withTheme } from "glamorous-native";

import ThemePropTypes from "../themes/ThemePropTypes";
import Button from "./Button";

class SignInForm extends Component {
  onPressSignIn = () => {
    this.props.navigation.dispatch({ type: "SignIn" });
  };

  onPressForgotPassword = () => {
    this.props.navigation.dispatch({ type: "ForgotPassword" });
  };

  renderErrorMessage() {
    const { theme, errorMessage } = this.props;
    return (
      <glamorous.Text
        allowFontScaling={false}
        style={theme.wrongEmailOrPasswordTextStyle}
        alignSelf="flex-start"
        paddingLeft={3}
        marginTop={-15}
        marginBottom={Platform.OS === "android" ? -3 : 8}
      >
        {errorMessage || " "}
      </glamorous.Text>
    );
  }

  render() {
    const { theme, style } = this.props;
    return (
      <KeyboardAvoidingView
        style={style}
        behavior="padding"
        keyboardVerticalOffset={-95}
      >
        <glamorous.Image
          source={require("../../assets/images/tidepool-logo-horizontal.png")}
          width={262}
          height={28.5}
          marginBottom={25}
          alignSelf="center"
        />
        {this.renderErrorMessage()}
        <glamorous.TextInput
          allowFontScaling={false}
          innerRef={textInput => {
            this.emailTextInput = textInput;
          }}
          style={theme.signInEditFieldStyle}
          returnKeyType="next"
          selectionColor="#657ef6"
          underlineColorAndroid="#657ef6"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="Email"
          placeholderTextColor={theme.signInEditFieldExtra.placeholderTextColor}
          keyboardAppearance={theme.signInEditFieldExtra.keyboardAppearance}
          borderColor="#e2e3e4"
          height={47.5}
          borderWidth={Platform.OS === "android" ? 0 : 1}
          paddingLeft={Platform.OS === "android" ? 3 : 12}
          onSubmitEditing={() => {
            this.passwordTextInput.focus();
          }}
        />
        <glamorous.TextInput
          allowFontScaling={false}
          innerRef={textInput => {
            this.passwordTextInput = textInput;
          }}
          style={theme.signInEditFieldStyle}
          secureTextEntry
          returnKeyType="go"
          selectionColor="#657ef6"
          underlineColorAndroid="#657ef6"
          placeholder="Password"
          placeholderTextColor={theme.signInEditFieldExtra.placeholderTextColor}
          keyboardAppearance={theme.signInEditFieldExtra.keyboardAppearance}
          borderColor="#e2e3e4"
          height={47.5}
          borderWidth={Platform.OS === "android" ? 0 : 1}
          paddingLeft={Platform.OS === "android" ? 3 : 12}
          marginTop={15}
        />
        <glamorous.View flexDirection="row" marginLeft={-8}>
          <glamorous.TouchableOpacity
            padding={8}
            onPress={this.onPressForgotPassword}
          >
            <glamorous.Text
              allowFontScaling={false}
              style={theme.forgotPasswordTextStyle}
              alignSelf="flex-start"
              paddingLeft={3}
            >
              Forgot password?
            </glamorous.Text>
          </glamorous.TouchableOpacity>
        </glamorous.View>
        <glamorous.View
          marginTop={-5}
          flexDirection="row"
          justifyContent="flex-end"
        >
          <Button onPress={this.onPressSignIn} title="Log in" />
        </glamorous.View>
      </KeyboardAvoidingView>
    );
  }
}

SignInForm.propTypes = {
  errorMessage: PropTypes.string,
  theme: ThemePropTypes.isRequired,
  style: ViewPropTypes.style,
  navigation: PropTypes.shape({
    dispatch: PropTypes.func.isRequired,
  }).isRequired,
};

SignInForm.defaultProps = {
  errorMessage: null,
  style: null,
};

export default withTheme(SignInForm);
