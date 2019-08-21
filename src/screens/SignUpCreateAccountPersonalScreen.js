import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import {
  SafeAreaView,
  View,
  StyleSheet,
  TextInput,
} from "react-native";
// import { StyleSheet, TextInput } from "react-native";
import { Formik } from "formik";

import {
  StyleProvider,
  Container,
  Button,
  Text,
   } from "native-base";

import getTheme from "../../native-base-theme/components";
import commonColor from "../../native-base-theme/variables/commonColor";

import { TextSignUpMidTitle } from "../components/TextSignUpMidTitle";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    borderColor: "#ededed",
    borderWidth: 1,
    height: 50,
    borderRadius: 4,
    paddingLeft: 14,
    color: "#6582ff",
    marginVertical: 5,
  },
});

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
                    />
                    <TextInput
                      style={styles.input}
                      onChangeText={formikProps.handleChange("name")}
                      placeholder="Email"
                    />
                    <TextInput
                      style={styles.input}
                      onChangeText={formikProps.handleChange("name")}
                      placeholder="Password"
                      secureTextEntry
                    />
                    <TextInput
                      style={styles.input}
                      onChangeText={formikProps.handleChange("name")}
                      placeholder="Confirm Password"
                      secureTextEntry
                    />
                    <View style={{ flex: 1, justifyContent: "flex-end" }}>
                      <Button block info onPress={formikProps.handleSubmit}>
                        <Text>Submit</Text>
                      </Button>
                      <Button
                        style={{ marginTop: 10 }}
                        block
                        onPress={this.onPressContinue}
                      >
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

SignUpCreateAccountPersonalScreen.propTypes = {
  navigateSignUpTermsOfUse: PropTypes.func.isRequired,
};

export default SignUpCreateAccountPersonalScreen;
