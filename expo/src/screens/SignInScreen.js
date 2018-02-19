import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Keyboard, LayoutAnimation, Platform, StatusBar } from "react-native";
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
  state = {};

  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      this.keyboardDidShow
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      this.keyboardDidHide
    );
    this.keyboardWillChangeFrameListener = Keyboard.addListener(
      "keyboardWillChangeFrame",
      this.keyboardWillChangeFrame
    );
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
    this.keyboardWillChangeFrameListener.remove();
  }

  onSignInFormLayout = event => {
    const { layout } = event.nativeEvent;
    const signInFormY = layout.y;
    this.setState({ signInFormY });
  };

  onKeyboardAvoidingViewHeight = height => {
    this.setState({ signInFormKeyboardAvoidingViewHeight: height });
  };

  scrollToAvoidKeyboard(event) {
    // Configure next LayoutAnimation
    let animationConfig;
    if (event && event.easing && event.duration) {
      animationConfig = {
        duration: event.duration,
        update: {
          type: LayoutAnimation.Types[event.easing],
        },
      };
    } else {
      animationConfig = { ...LayoutAnimation.Presets.easeInEaseOut };
    }
    LayoutAnimation.configureNext({
      ...animationConfig,
      duration: 175,
      useNativeDriver: true,
    });

    // Calculate scrollY
    let scrollY = 0;
    if (event) {
      const keyboardY = event ? event.endCoordinates.screenY : 0;
      const paddingY = 10;
      scrollY =
        this.state.signInFormY +
        this.state.signInFormKeyboardAvoidingViewHeight +
        paddingY -
        keyboardY;
      if (scrollY < 0) {
        scrollY = 0;
      }
    }

    // Scroll
    this.setState({ signInFormContainerTop: -scrollY });
  }

  keyboardDidShow = event => {
    if (Platform.OS === "android") {
      this.scrollToAvoidKeyboard(event);
    }
  };

  keyboardDidHide = event => {
    if (Platform.OS === "android") {
      this.scrollToAvoidKeyboard(event);
    }
  };

  keyboardWillChangeFrame = event => {
    // Currently using adjustResize for Android, so, Android won't get keyboardWillChangeFrame. We should revisit this.
    if (Platform.OS === "ios") {
      this.scrollToAvoidKeyboard(event);
    }
  };

  theme = PrimaryTheme;

  render() {
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
          onLayout={this.onContainerViewLayout}
        >
          <StatusBar barStyle="dark-content" />
          <SignUp
            style={{
              alignSelf: "flex-end",
              top: 44 + safeAreaTopInset,
              zIndex: 1,
              position: "absolute",
            }}
            navigateSignUp={this.props.navigateSignUp}
          />
          <glamorous.View
            onLayout={this.onSignInFormLayout}
            top={this.state.signInFormContainerTop}
          >
            <SignInForm
              errorMessage={errorMessage}
              navigateForgotPassword={navigateForgotPassword}
              authSignInReset={authSignInReset}
              authSignInAsync={authSignInAsync}
              signingIn={signingIn}
              onKeyboardAvoidingViewHeight={this.onKeyboardAvoidingViewHeight}
            />
          </glamorous.View>
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
