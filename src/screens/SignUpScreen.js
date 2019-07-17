import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { SafeAreaView, StatusBar, StyleSheet, View } from "react-native";
import { Button, Text } from 'native-base';

import glamorous, { ThemeProvider } from "glamorous-native";

import PrimaryTheme from "../themes/PrimaryTheme";

import ButtonFlow from "../components/ButtonFlow";
import ButtonAccountType from "../components/ButtonAccountType";
import TextSignUpMidTitle from "../components/TextSignUpMidTitle";

const styles = StyleSheet.create({
  bottom: {
    flex: 1,
    justifyContent: "flex-end",
  },
});

class SignUpScreen extends PureComponent {
  theme = PrimaryTheme;
  state = {};

  onPressContinue = () => {
    const { navigateSignUpCreateAccount } = this.props;
    navigateSignUpCreateAccount();
  };

  render() {
    return (
      <ThemeProvider theme={this.theme}>
        <View
          flex={1}
          backgroundColor={this.theme.colors.whiteBackground}
        >
          <StatusBar barStyle="light-content" />
          <SafeAreaView flex={1} justifyContent="space-between" margin={16}>
            <TextSignUpMidTitle title="What kind of account do you need?" />
<Button><Text>Hello</Text></Button>
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

            <View style={styles.bottom}>
              <ButtonFlow title="Continue" onPress={this.onPressContinue} />
            </View>
          </SafeAreaView>
        </View>
      </ThemeProvider>
    );
  }
}

SignUpScreen.propTypes = {
  navigateSignUpCreateAccount: PropTypes.func.isRequired,
};

export default SignUpScreen;
