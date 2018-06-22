import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import {
  Keyboard,
  LayoutAnimation,
  Platform,
  SafeAreaView,
  StatusBar,
} from "react-native";
import glamorous, { ThemeProvider } from "glamorous-native";

import PrimaryTheme from "../themes/PrimaryTheme";
import MadePossibleBy from "../components/MadePossibleBy";
import SignUp from "../components/SignUp";
import SignInForm from "../components/SignInForm";
import VersionAndApiEnvironment from "../components/VersionAndApiEnvironment";
import DebugSettingsTouchable from "../components/DebugSettingsTouchable";

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

  onContainerViewLayout = event => {
    if (!this.state.isKeyboardVisible) {
      const { layout } = event.nativeEvent;
      const containerViewHeightWithoutKeyboard = layout.height;
      this.setState({ containerViewHeightWithoutKeyboard });
    }
  };

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

  // FIXME: Not called on Android with adjustNothing windowSoftInputMode. See: https://github.com/facebook/react-native/issues/3468#issuecomment-329603915 and https://github.com/facebook/react-native/issues/2852. Ideally we want adjustNothing and manage the keyboard avoidance ourselves, rather than adjustResize
  keyboardDidShow = event => {
    this.setState({ isKeyboardVisible: true });
    if (Platform.OS === "android") {
      this.scrollToAvoidKeyboard(event);
    }
  };

  keyboardDidHide = event => {
    this.setState({ isKeyboardVisible: false });
    if (Platform.OS === "android") {
      this.scrollToAvoidKeyboard(event);
    }
  };

  keyboardWillChangeFrame = event => {
    // Currently using adjustResize for Android, so, Android won't get keyboardWillChangeFrame. We
    // should revisit this.
    const { startCoordinates, endCoordinates } = event;
    const coordinatesAreDifferent =
      startCoordinates.screenX !== endCoordinates.screenX ||
      startCoordinates.screenY !== endCoordinates.screenY ||
      startCoordinates.height !== endCoordinates.height ||
      startCoordinates.width !== endCoordinates.width;
    if (Platform.OS === "ios" && coordinatesAreDifferent) {
      this.scrollToAvoidKeyboard(event);
    }
  };

  theme = PrimaryTheme;

  renderHeader() {
    return (
      <SignUp
        style={{
          alignSelf: "flex-end",
          marginTop: 30,
        }}
        navigateSignUp={this.props.navigateSignUp}
      />
    );
  }

  renderFooter() {
    const { version, apiEnvironment, navigateDebugSettings } = this.props;

    return (
      <DebugSettingsTouchable
        style={{
          marginBottom: 15,
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
    );
  }

  renderSignInForm() {
    const {
      errorMessage,
      navigateForgotPassword,
      authSignInReset,
      authSignInAsync,
      signingIn,
    } = this.props;

    return (
      <SignInForm
        errorMessage={errorMessage}
        navigateForgotPassword={navigateForgotPassword}
        authSignInReset={authSignInReset}
        authSignInAsync={authSignInAsync}
        signingIn={signingIn}
        onKeyboardAvoidingViewHeight={this.onKeyboardAvoidingViewHeight}
      />
    );
  }

  render() {
    return (
      <ThemeProvider theme={this.theme}>
        <glamorous.View
          flex={1}
          // FIXME: This minHeight is needed to work around Android issue where adjustResize windowSoftInputMode causes the window size to change, thus squishing the view and revealing the footer rather than obscuring it. See: https://github.com/facebook/react-native/issues/3468#issuecomment-329603915 and https://github.com/facebook/react-native/issues/2852. Ideally we want adjustNothing and manage the keyboard avoidance ourselves, rather than adjustResize
          minHeight={
            Platform.OS === "android"
              ? this.state.containerViewHeightWithoutKeyboard
              : null
          }
          backgroundColor={this.theme.colors.lightBackground}
          onLayout={this.onContainerViewLayout}
        >
          <StatusBar barStyle="dark-content" />
          <SafeAreaView
            flex={1}
            justifyContent="space-between"
            marginLeft={20}
            marginRight={20}
          >
            {this.renderHeader()}
            <glamorous.View
              onLayout={this.onSignInFormLayout}
              top={this.state.signInFormContainerTop}
            >
              {this.renderSignInForm()}
            </glamorous.View>
            {this.renderFooter()}
          </SafeAreaView>
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
