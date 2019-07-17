import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { SafeAreaView, View, Picker, Switch } from "react-native";

import { Container, Text, Button, StyleProvider } from "native-base";
import getTheme from "../../native-base-theme/components";
import commonColor from "../../native-base-theme/variables/commonColor";

import TextSignUpMidTitle from "../components/TextSignUpMidTitle";

class SignUpTermsOfUseScreen extends PureComponent {
  state = { };

  onPressContinue = () => {
    const { navigateSignUpDiabetesDetails } = this.props;
    navigateSignUpDiabetesDetails();
  };

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <StyleProvider style={getTheme(commonColor)}>
          <Container>
            <View style={{ flex: 1, margin: 16 }}>
              <TextSignUpMidTitle title="Enter your age and acknowledge terms of use." />
              <Picker flex={1}>
                <Picker.Item label="I am 18 years or older" value="18" />
                <Picker.Item label="I am between 13 and 17 years old" value="13" />
                <Picker.Item label="I am 12 years old or younger" value="12" />
              </Picker>
              <Switch />
              <Text>I am 18 or older and accept the terms of the Tidepool App Terms of Use and Privacy Policy</Text>
              <View style={{ flex: 1, justifyContent: "flex-end" }}>
                <Button block onPress={this.onPressContinue}>
                  <Text>Continue</Text>
                </Button>
              </View>
            </View>
          </Container>
        </StyleProvider>
      </SafeAreaView>

    );
  }
}

SignUpTermsOfUseScreen.propTypes = {
  navigateSignUpDiabetesDetails: PropTypes.func.isRequired,
  // navigatePrivacyAndTerms: PropTypes.func.isRequired, // TODO: call this when tapping on link
};

export default SignUpTermsOfUseScreen;
