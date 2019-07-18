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

class SignUpCreateAccountClinicianScreen extends PureComponent {
  state = {};

  onPressClinicianSetup = () => {
    const { navigateSignUpClinicianSetup } = this.props;
    navigateSignUpClinicianSetup();
  };

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <StyleProvider style={getTheme(commonColor)}>
          <Container>
            <View style={{ flex: 1, justifyContent: "flex-end", margin: 16 }}>
              <TextSignUpMidTitle title="See all your patients and all their device data in one place." />
              <Form>
                <Item>
                  <Input placeholder="Email" />
                </Item>
                <Item>
                  <Input placeholder="Password" />
                </Item>
                <Item>
                  <Input placeholder="Confirm Password" />
                </Item>
                <Item>
                  <Input placeholder="TOU Checkbox" />
                </Item>
              </Form>
              <View style={{ flex: 1, justifyContent: "flex-end" }}>
                <Button block onPress={this.onPressClinicianSetup}>
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

SignUpCreateAccountClinicianScreen.propTypes = {
  navigateSignUpClinicianSetup: PropTypes.func.isRequired,
};

export default SignUpCreateAccountClinicianScreen;
