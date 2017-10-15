import React from "react";
import PropTypes from "prop-types";
import glamorous, { withTheme } from "glamorous-native";
import { isIphoneX } from "react-native-iphone-x-helper";

import MadePossibleBy from "../../components/MadePossibleBy";
import SignUp from "../../components/SignUp";
import SignInForm from "../../components/SignInForm";
import ThemePropTypes from "../../themes/ThemePropTypes";
import VersionAndEnvironment from "../../components/VersionAndEnvironment";

const safeAreaTopInset = isIphoneX() ? 24 : 0;
const safeAreaBottomInset = isIphoneX() ? 20 : 0;

const SignInScreen = ({ theme, errorMessage }) => {
  const version = "2.0.1"; // TODO: redux - move to redux state
  const environment = "staging"; // TODO: redux - move to redux state

  return (
    <glamorous.View
      flex={1}
      backgroundColor={theme.colors.lightBackgroundColor}
      justifyContent="center"
      alignItems="center"
    >
      <glamorous.View justifyContent="center" alignItems="center">
        <SignUp
          style={{
            alignSelf: "flex-end",
            top: 44 + safeAreaTopInset,
            zIndex: 1,
            position: "absolute",
          }}
        />
        <SignInForm
          style={{ width: 300, flex: 1, justifyContent: "center" }}
          errorMessage={errorMessage}
        />
        <glamorous.View position="absolute" bottom={45 + safeAreaBottomInset}>
          <MadePossibleBy />
        </glamorous.View>
        <glamorous.View position="absolute" bottom={15 + safeAreaBottomInset}>
          <VersionAndEnvironment version={version} environment={environment} />
        </glamorous.View>
      </glamorous.View>
    </glamorous.View>
  );
};

SignInScreen.propTypes = {
  errorMessage: PropTypes.string,
  theme: ThemePropTypes.isRequired,
};

SignInScreen.defaultProps = {
  errorMessage: null,
};

export default withTheme(SignInScreen);
