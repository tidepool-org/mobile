import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { SafeAreaView, View, Alert } from "react-native";

import {
  StyleProvider,
  Container,
  Text,
  Button,
} from "native-base";
import getTheme from "../../native-base-theme/components";
import commonColor from "../../native-base-theme/variables/commonColor";

import { DatePickerCustom } from "../components/DatePickerCustom";
import { SingleSelectCustom } from "../components/SingleSelectCustom";
import { TextSignUpMidTitle } from "../components/TextSignUpMidTitle";

class SignUpDiabetesDetailsScreen extends PureComponent {
  state = {};

  onPressDonateData = () => {
    const { navigateSignUpDonateData } = this.props;
    navigateSignUpDonateData();
  };

  showAlert = () => {
    Alert.alert("Alert!");
  };

  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
        <StyleProvider style={getTheme(commonColor)}>
          <Container>
            <View style={{ flex: 1, margin: 16 }}>
              <TextSignUpMidTitle title="A few more questions about you." />

              <SingleSelectCustom title="Whose diabetes data is this?" />

              <SingleSelectCustom title="Type of diabetes" />

              <DatePickerCustom title="Birthday" />

              <DatePickerCustom title="Diagnosis date" />

              <View style={{ flex: 1, justifyContent: "flex-end" }}>
                <Button block onPress={this.onPressDonateData}>
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

SignUpDiabetesDetailsScreen.propTypes = {
  navigateSignUpDonateData: PropTypes.func.isRequired,
};

export default SignUpDiabetesDetailsScreen;
