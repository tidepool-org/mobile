import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { StyleSheet, SafeAreaView, StatusBar, Picker, Switch, Text } from "react-native";
import glamorous, { ThemeProvider } from "glamorous-native";

import PrimaryTheme from "../themes/PrimaryTheme";
import ButtonFlow from "../components/ButtonFlow";
import TextSignUpMidTitle from "../components/TextSignUpMidTitle";

const styles = StyleSheet.create({
  bottom: {
    flex: 1,
    justifyContent: "flex-end",
  },
});

class SignUpTermsOfUseScreen extends PureComponent {
  theme = PrimaryTheme;
  state = { };

  onPressContinue = () => {
    const { navigateSignUpDiabetesDetails } = this.props;
    navigateSignUpDiabetesDetails();
  };

  render() {
    return (
      <ThemeProvider theme={this.theme}>
        <glamorous.View
          flex={1}
          backgroundColor={this.theme.colors.lightBackground}
        >
          <StatusBar barStyle="light-content" />
          <SafeAreaView flex={1} justifyContent="space-between" margin={16}>
            <TextSignUpMidTitle title="Enter your age and acknowledge terms of use." />

            <Picker flex={1}>
              <Picker.Item label="I am 18 years or older" value="18" />
              <Picker.Item label="I am between 13 and 17 years old" value="13" />
              <Picker.Item label="I am 12 years old or younger" value="12" />
            </Picker>
            <glamorous.View>
              <Switch />
              <Text>I am 18 or older and accept the terms of the Tidepool App Terms of Use and Privacy Policy</Text>
            </glamorous.View>

            <glamorous.View style={styles.bottom}>
              <ButtonFlow title="Continue" onPress={this.onPressContinue} />
            </glamorous.View>

          </SafeAreaView>
        </glamorous.View>
      </ThemeProvider>
    );
  }
}

SignUpTermsOfUseScreen.propTypes = {
  navigateSignUpDiabetesDetails: PropTypes.func.isRequired,
  // navigatePrivacyAndTerms: PropTypes.func.isRequired, // TODO: call this when tapping on link
};

export default SignUpTermsOfUseScreen;
