import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { StatusBar } from "react-native";
import glamorous, { ThemeProvider } from "glamorous-native";
import { isIphoneX } from "react-native-iphone-x-helper";

import PrimaryTheme from "../themes/PrimaryTheme";
import MadePossibleBy from "../components/MadePossibleBy";
import SignUp from "../components/SignUp";
import SignInForm from "../components/SignInForm";
import VersionAndApiEnvironment from "../components/VersionAndApiEnvironment";
import DebugSettingsTouchable from "../components/DebugSettingsTouchable";

const safeAreaTopInset = isIphoneX() ? 24 : 0;
const safeAreaBottomInset = isIphoneX() ? 20 : 0;

class SignInScreen extends PureComponent {
  theme = PrimaryTheme;

  render() {
    // console.log("SignInScreen: render");

    const {
      errorMessage,
      version,
      apiEnvironment,
      navigateDebugSettings,
      navigateForgotPassword,
      authSignInReset,
      authSignInAsync,
      signingIn,
    } = this.props;

    return (
      <ThemeProvider theme={this.theme}>
        <glamorous.View
          flex={1}
          backgroundColor={this.theme.colors.lightBackground}
          justifyContent="center"
          alignItems="center"
        >
          <StatusBar barStyle="dark-content" />
          <glamorous.View justifyContent="center" alignItems="center">
            <SignUp
              style={{
                alignSelf: "flex-end",
                top: 44 + safeAreaTopInset,
                zIndex: 1,
                position: "absolute",
              }}
              navigateSignUp={this.props.navigateSignUp}
            />
            <SignInForm
              style={{ width: 300, flex: 1, justifyContent: "center" }}
              errorMessage={errorMessage}
              navigateForgotPassword={navigateForgotPassword}
              authSignInReset={authSignInReset}
              authSignInAsync={authSignInAsync}
              signingIn={signingIn}
            />
            <DebugSettingsTouchable
              style={{
                position: "absolute",
                bottom: 15 + safeAreaBottomInset,
              }}
              navigateDebugSettings={navigateDebugSettings}
            >
              <glamorous.View
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
              >
                <MadePossibleBy />
                <VersionAndApiEnvironment
                  version={version}
                  apiEnvironment={apiEnvironment}
                />
              </glamorous.View>
            </DebugSettingsTouchable>
          </glamorous.View>
        </glamorous.View>
      </ThemeProvider>
    );
  }
}

SignInScreen.propTypes = {
  navigateSignUp: PropTypes.func.isRequired,
  navigateDebugSettings: PropTypes.func.isRequired,
  navigateForgotPassword: PropTypes.func.isRequired,
  authSignInReset: PropTypes.func.isRequired,
  authSignInAsync: PropTypes.func.isRequired,
  signingIn: PropTypes.bool.isRequired,
  errorMessage: PropTypes.string,
  version: PropTypes.string.isRequired,
  apiEnvironment: PropTypes.string.isRequired,
};

SignInScreen.defaultProps = {
  errorMessage: "",
};

export default SignInScreen;
