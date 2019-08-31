import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { SafeAreaView, View, StyleSheet, TextInput } from "react-native";
import { Formik } from "formik";

import {
  StyleProvider,
  Container,
  Button,
  Text,
   } from "native-base";

import getTheme from "../../native-base-theme/components";
import commonColor from "../../native-base-theme/variables/commonColor";

import { SingleSelectCustom } from "../components/SingleSelectCustom";
import { TextSignUpMidTitle } from "../components/TextSignUpMidTitle";

const styles = StyleSheet.create({
  input: {
    borderColor: "#ededed",
    borderWidth: 1,
    height: 58,
    borderRadius: 4,
    paddingLeft: 14,
    color: "#6582ff",
    marginVertical: 5,
    fontSize: 18,
  },
});

class SignUpClinicianSetupScreen extends PureComponent {
  state = {};

  onPressActivateAccount = () => {
    const { navigateSignUpActivateAccount } = this.props;
    navigateSignUpActivateAccount();
  };

  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
        <StyleProvider style={getTheme(commonColor)}>
          <Container>
            <View style={{ flex: 1, justifyContent: "flex-end", margin: 16 }}>
              <TextSignUpMidTitle title="Help us support you better with this info." />

              <Formik
                initialValues={{ name: "" }}
                onSubmit={this.onPressContinue}
              >
                {formikProps => (
                  <React.Fragment>
                    <TextInput
                      style={styles.input}
                      onChangeText={formikProps.handleChange("name")}
                      placeholder="Full Name"
                      placeholderTextColor="#838383"
                    />
                    <View style={{ paddingBottom: 15 }}>
                      <SingleSelectCustom title="Role" />
                    </View>
                    <TextInput
                      style={styles.input}
                      onChangeText={formikProps.handleChange("name")}
                      placeholder="Clinic Name"
                      placeholderTextColor="#838383"
                    />
                    <TextInput
                      style={styles.input}
                      onChangeText={formikProps.handleChange("name")}
                      placeholder="Clinic Phone Number (Optional)"
                      placeholderTextColor="#838383"
                    />
                    <View style={{ flex: 1, justifyContent: "flex-end" }}>
                      <Button block onPress={this.onPressActivateAccount}>
                        <Text>Continue</Text>
                      </Button>
                    </View>
                  </React.Fragment>
                )}
              </Formik>
            </View>
          </Container>
        </StyleProvider>
      </SafeAreaView>
    );
  }
}

SignUpClinicianSetupScreen.propTypes = {
  navigateSignUpActivateAccount: PropTypes.func.isRequired,
};

export default SignUpClinicianSetupScreen;
