import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { StatusBar } from "react-native";
import glamorous, { ThemeProvider } from "glamorous-native";
import { isIphoneX } from "react-native-iphone-x-helper";

import PrimaryTheme from "../themes/PrimaryTheme";
import MadePossibleBy from "../components/MadePossibleBy";
import SignUp from "../components/SignUp";
import SignInFormContainer from "../containers/SignInFormContainer";
import VersionAndEnvironment from "../components/VersionAndEnvironment";

const safeAreaTopInset = isIphoneX() ? 24 : 0;
const safeAreaBottomInset = isIphoneX() ? 20 : 0;

class SignInScreen extends PureComponent {
  render() {
    const { errorMessage } = this.props;

    const version = "2.0.1"; // TODO: redux
    const environment = "staging"; // TODO: redux
    const theme = PrimaryTheme;

    return (
      <ThemeProvider theme={theme}>
        <glamorous.View
          flex={1}
          backgroundColor={theme.colors.lightBackground}
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
            <SignInFormContainer
              style={{ width: 300, flex: 1, justifyContent: "center" }}
              errorMessage={errorMessage}
            />
            <glamorous.View
              position="absolute"
              bottom={45 + safeAreaBottomInset}
            >
              <MadePossibleBy />
            </glamorous.View>
            <glamorous.View
              position="absolute"
              bottom={15 + safeAreaBottomInset}
            >
              <VersionAndEnvironment
                version={version}
                environment={environment}
              />
            </glamorous.View>
          </glamorous.View>
        </glamorous.View>
      </ThemeProvider>
    );
  }
}

SignInScreen.propTypes = {
  navigateSignUp: PropTypes.func.isRequired,
  errorMessage: PropTypes.string,
};

SignInScreen.defaultProps = {
  errorMessage: "",
};

export default SignInScreen;
