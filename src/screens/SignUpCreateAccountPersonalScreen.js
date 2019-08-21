import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import {
  SafeAreaView,
  View,
} from "react-native";
// import { StyleSheet, TextInput } from "react-native";
// import { Formik } from "formik";

import {
  StyleProvider,
  Container,
  Form,
  Item,
  Button,
  Text,
  Input,
   } from "native-base";

import getTheme from "../../native-base-theme/components";
import commonColor from "../../native-base-theme/variables/commonColor";

import { TextSignUpMidTitle } from "../components/TextSignUpMidTitle";

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   input: {
//     borderColor: "#DCE0F9",
//     borderWidth: 5,
//   },
// });

class SignUpCreateAccountPersonalScreen extends PureComponent {
  state = {};

  onPressContinue = () => {
    const { navigateSignUpTermsOfUse } = this.props;
    navigateSignUpTermsOfUse();
  };

  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
        <StyleProvider style={getTheme(commonColor)}>
          <Container>
            <View style={{ flex: 1, justifyContent: "flex-end", margin: 16 }}>
              <TextSignUpMidTitle title="See all your diabetes data in one place." />
              <Form>
                <Item>
                  <Input placeholder="Full Name" />
                </Item>
                <Item>
                  <Input placeholder="Email" />
                </Item>
                <Item>
                  <Input placeholder="Password" />
                </Item>
                <Item>
                  <Input placeholder="Confirm Password" />
                </Item>
              </Form>
              <View style={{ flex: 1, justifyContent: "flex-end" }}>
                <Button block onPress={this.onPressContinue}>
                  <Text style={{ color: 'white' }}>Continue</Text>
                </Button>
              </View>
            </View>
          </Container>
        </StyleProvider>
      </SafeAreaView>
    );
  }
}

SignUpCreateAccountPersonalScreen.propTypes = {
  navigateSignUpTermsOfUse: PropTypes.func.isRequired,
};

export default SignUpCreateAccountPersonalScreen;
