import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { SafeAreaView, StatusBar } from "react-native";
import glamorous, { ThemeProvider } from "glamorous-native";

import PrimaryTheme from "../themes/PrimaryTheme";
import Button from "../components/Button";

class SignUpCreateAccountScreen extends PureComponent {
  theme = PrimaryTheme;
  state = {};

  onPressContinue = () => {
    const { navigateSignUpTermsOfUse } = this.props;
    navigateSignUpTermsOfUse();
  };

  render() {
    return (
      <ThemeProvider theme={this.theme}>
        <glamorous.View
          flex={1}
          backgroundColor={this.theme.colors.lightBackground}
        >
          <StatusBar barStyle="light-content" />
          <SafeAreaView
            flex={1}
            justifyContent="space-between"
            marginLeft={20}
            marginRight={20}
          >
            <glamorous.View>
              <Button
                title="Continue"
                onPress={this.onPressContinue}
                containerStyle={{
                  marginLeft: 0,
                  marginRight: 0,
                }}
              />
            </glamorous.View>
          </SafeAreaView>
        </glamorous.View>
      </ThemeProvider>
    );
  }
}

SignUpCreateAccountScreen.propTypes = {
  navigateSignUpTermsOfUse: PropTypes.func.isRequired,
};

export default SignUpCreateAccountScreen;
