import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { SafeAreaView, View } from "react-native";

import {
  StyleProvider,
  Container,
  Text,
  Button,
} from "native-base";
import getTheme from "../../native-base-theme/components";
import commonColor from "../../native-base-theme/variables/commonColor";

import { SwitchCustom } from "../components/SwitchCustom";
import { TextSignUpMidTitle } from "../components/TextSignUpMidTitle";

class SignUpDonateDataScreen extends PureComponent {

  onPressContinue = () => {
    const { navigateSignUpActivateAccount } = this.props;
    navigateSignUpActivateAccount();
  };

  render() {

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }}>
        <StyleProvider style={getTheme(commonColor)}>
          <Container>
            <View style={{ flex: 1, margin: 16 }}>
              <TextSignUpMidTitle title="Would you like to donate your data?" />
              
              <Text
                style={{
                  color: "#7e98c3",
                  fontSize: 16,
                  lineHeight: 24,
                  marginTop: 20,
                  paddingBottom: 20,
                }}
              >
                You own your data. Read all the details about Tidepool’s Big
                Data Donation project here.
              </Text>
              
              <SwitchCustom switchText="Donate my anonymized diabetes data" />

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

SignUpDonateDataScreen.propTypes = {
  navigateSignUpActivateAccount: PropTypes.func.isRequired,
};

export default SignUpDonateDataScreen;
