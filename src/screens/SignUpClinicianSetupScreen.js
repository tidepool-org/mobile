import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { SafeAreaView, View } from "react-native";

import {
  StyleProvider,
  Container,
  Text,
  Button,
  Form,
  Item,
  Input,
   } from "native-base";

import getTheme from "../../native-base-theme/components";
import commonColor from "../../native-base-theme/variables/commonColor";

import TextSignUpMidTitle from "../components/TextSignUpMidTitle";

class SignUpClinicianSetupScreen extends PureComponent {
  state = {};

  onPressContinue = () => {
    const { navigateSignUpTermsOfUse } = this.props;
    navigateSignUpTermsOfUse();
  };

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <StyleProvider style={getTheme(commonColor)}>
          <Container>
            <View style={{ flex: 1, justifyContent: "flex-end", margin: 16 }}>
              <TextSignUpMidTitle title="Help us support you better with this info." />
              <Form>
                <Item>
                  <Input placeholder="Full Name" />
                </Item>
                <Item>
                  <Input placeholder="Role - Dropdown" />
                </Item>
                <Item>
                  <Input placeholder="Clinic Name" />
                </Item>
                <Item>
                  <Input placeholder="Clinic Phone Number (Optional)" />
                </Item>
              </Form>
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

SignUpClinicianSetupScreen.propTypes = {
  navigateSignUpTermsOfUse: PropTypes.func.isRequired,
};

export default SignUpClinicianSetupScreen;
