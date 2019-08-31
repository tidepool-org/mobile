import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { SafeAreaView, View, StyleSheet } from "react-native";

import { openInbox } from "react-native-email-link";

import { Container, Text, Button, StyleProvider } from "native-base";
import getTheme from "../../native-base-theme/components";
import commonColor from "../../native-base-theme/variables/commonColor";


import { TextSignUpMidTitle } from "../components/TextSignUpMidTitle";
import { TextSignUpSubTitle } from "../components/TextSignUpSubTitle";

const styles = StyleSheet.create({
  subTitleText: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    color: "#7e98c3",
    marginBottom: 26,
    fontWeight: "500",
  },
});

class SignUpActivateAccountScreen extends PureComponent {
  state = {};

  onPressContinue = () => {
    const { navigateSignIn } = this.props;
    navigateSignIn();
  };

  onPressEmail = () => {
    openInbox();
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
        <StyleProvider style={getTheme(commonColor)}>
          <Container>
            <View style={{ flex: 1, margin: 16 }}>
              <TextSignUpMidTitle title="Keeping your data private and secure is important to us!" />
              <Text style={styles.subTitleText}>
                To activate your account, please click the link in the email we
                just sent to jill@jellyfish.com
              </Text>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                <Button style={{}} onPress={this.onPressEmail}>
                  <Text>Go to My Email</Text>
                </Button>
              </View>

              <View style={{ flex: 1, justifyContent: "flex-end" }}>
                <Button block onPress={this.onPressContinue}>
                  <Text>Back to Sign in</Text>
                </Button>
              </View>
            </View>
          </Container>
        </StyleProvider>
      </SafeAreaView>
    );
  }
}

SignUpActivateAccountScreen.propTypes = {
  navigateSignIn: PropTypes.func.isRequired,
};

export default SignUpActivateAccountScreen;
