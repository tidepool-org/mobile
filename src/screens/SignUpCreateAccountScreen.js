import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { SafeAreaView, StatusBar, StyleSheet } from "react-native";
import glamorous, { ThemeProvider } from "glamorous-native";

import PrimaryTheme from "../themes/PrimaryTheme";
import ButtonFlow from "../components/ButtonFlow";

const styles = StyleSheet.create({
  bottom: {
    flex: 1,
    justifyContent: 'flex-end',
  },
});

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
            margin={16}
          >
            <glamorous.View style={styles.bottom}>
                <ButtonFlow
                  title="Continue"
                  onPress={this.onPressContinue}
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
