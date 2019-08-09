import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { SafeAreaView, View } from "react-native";

import { Container, Text, Button, StyleProvider } from "native-base";
import getTheme from "../../native-base-theme/components";
import commonColor from "../../native-base-theme/variables/commonColor";

import { ButtonWithHeaderAndLongText } from "../components/ButtonWithHeaderAndLongText";
import { TextSignUpMidTitle } from "../components/TextSignUpMidTitle";


class SignUpScreen extends PureComponent {
  state = {};

  onPressCreateAccountClinician = () => {
    const { navigateSignUpCreateAccountClinician } = this.props;
    navigateSignUpCreateAccountClinician();
  };

  onPressCreateAccountPersonal = () => {
    const { navigateSignUpCreateAccountPersonal } = this.props;
    navigateSignUpCreateAccountPersonal();
  };

  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
        <StyleProvider style={getTheme(commonColor)}>
          <Container>
            <View style={{ flex: 1, margin: 16 }}>
              <TextSignUpMidTitle title="What kind of account do you need?" />
              <ButtonWithHeaderAndLongText
                title="Personal Account"
                onPress={this.onPressCreateAccountPersonal}
                bodyText="You want to manage your diabetes data. You are caring for or supporting someone with diabetes."
              />
              <ButtonWithHeaderAndLongText
                title="Clinic Account"
                onPress={this.onPressCreateAccountClinician}
                bodyText="You are a doctor, a clinic or other healthcare provider that wants to use Tidepool to help people in your care."
              />
              <View style={{ flex: 1, justifyContent: "flex-end" }}>
                <Button block onPress={this.onPressCreateAccount}>
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
  navigateSignUpCreateAccountClinician: PropTypes.func.isRequired,
  navigateSignUpCreateAccountPersonal: PropTypes.func.isRequired,
};

export default SignUpScreen;
