import React, { PureComponent } from "react";
import PropTypes from "prop-types";
// import { SafeAreaView, StatusBar, StyleSheet, View } from "react-native";
import { StyleSheet, View } from "react-native";

// import { Container, Content, StyleProvider, Button, Text } from 'native-base';

import {
  Container,
  Header,
  Body,
  Title,
  Left,
  Right,
  Content,
  Text,
  Card,
  CardItem,
  Button,
  StyleProvider,
} from "native-base";

import getTheme from '../../native-base-theme/components';
import commonColor from '../../native-base-theme/variables/commonColor';

// import glamorous, { ThemeProvider } from "glamorous-native";
// import PrimaryTheme from "../themes/PrimaryTheme";

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
  state = {};

  onPressContinue = () => {
    const { navigateSignUpCreateAccount } = this.props;
    navigateSignUpCreateAccount();
  };

  render() {
    return (
      <StyleProvider style={getTheme(commonColor)}>
        <Container>
          <View style={{ flex: 1, justifyContent: "flex-end", margin: 16 }}>
            <TextSignUpMidTitle title="What kind of account do you need?" />
            <ButtonAccountType
              title="Clinic Account"
              onPress={this.onPressContinue}
              bodyText="You are a doctor, a clinic or other healthcare provider that wants to use Tidepool to help people in your care."
            />
            <View style={{ flex: 1, justifyContent: "flex-end" }}>
              <Button
              block
              onPress={this.onPressContinue}
              >
            <Text>Continue</Text>
            </Button>
            </View>
          </View>
        </Container>
      </StyleProvider>

    );
  }
}

SignUpScreen.propTypes = {
  navigateSignUpCreateAccount: PropTypes.func.isRequired,
};

export default SignUpScreen;
