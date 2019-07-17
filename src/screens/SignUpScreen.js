import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { SafeAreaView, View } from "react-native";

import { Container, Text, Button, StyleProvider } from "native-base";

import getTheme from "../../native-base-theme/components";
import commonColor from "../../native-base-theme/variables/commonColor";

import ButtonAccountType from "../components/ButtonAccountType";
import TextSignUpMidTitle from "../components/TextSignUpMidTitle";


class SignUpScreen extends PureComponent {
  state = {};

  onPressContinue = () => {
    const { navigateSignUpCreateAccount } = this.props;
    navigateSignUpCreateAccount();
  };

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <StyleProvider style={getTheme(commonColor)}>
          <Container>
            <View style={{ flex: 1, justifyContent: "flex-end", margin: 16 }}>
              <TextSignUpMidTitle title="What kind of account do you need?" />
              <ButtonAccountType
                title="Personal Account"
                onPress={this.onPressContinue}
                bodyText="You want to manage your diabetes data. You are caring for or supporting someone with diabetes."
              />
              <ButtonAccountType
                title="Clinic Account"
                onPress={this.onPressContinue}
                bodyText="You are a doctor, a clinic or other healthcare provider that wants to use Tidepool to help people in your care."
              />
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

SignUpScreen.propTypes = {
  navigateSignUpCreateAccount: PropTypes.func.isRequired,
};

export default SignUpScreen;
