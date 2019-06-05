import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { SafeAreaView, StatusBar, StyleSheet } from "react-native";
import glamorous, { ThemeProvider } from "glamorous-native";

import PrimaryTheme from "../themes/PrimaryTheme";
import ButtonFlow from "../components/ButtonFlow";
import ButtonAccountType from "../components/ButtonAccountType";

const styles = StyleSheet.create({
  bottom: {
    flex: 1,
    justifyContent: 'flex-end',
  },
});

const TitleText = glamorous.text({
  fontSize: 24,
  textAlign: 'center',
  lineHeight: 32,
  color: '#4f6a92',
  marginTop: 17,
  marginBottom: 14,
  fontWeight: 'bold',
});

const SubTitleText = glamorous.text({
  fontSize: 16,
  textAlign: 'center',
  lineHeight: 24,
  color: '#7e98c3',
  marginBottom: 26,
  fontWeight: 'bold',
});

const LogoHold = glamorous.view({
  width: 18,
  height: 18,
  backgroundColor: 'white',
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

              <TitleText>Sign Up for Tidepool</TitleText>
              <SubTitleText>What kind of account do you need?</SubTitleText>
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

SignUpScreen.propTypes = {
  navigateSignUpCreateAccount: PropTypes.func.isRequired,
};

export default SignUpScreen;
