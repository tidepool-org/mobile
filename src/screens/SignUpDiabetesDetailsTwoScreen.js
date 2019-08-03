import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { SafeAreaView, View } from "react-native";

import {
  StyleProvider,
  Container,
  Text,
  Button,
} from "native-base";
import getTheme from "../../native-base-theme/components";
import commonColor from "../../native-base-theme/variables/commonColor";

import TextSignUpMidTitle from "../components/TextSignUpMidTitle";
import HrCustom from "../components/HrCustom";
import DatePickerCustom from "../components/DatePickerCustom";
import SwitchCustom from "../components/SwitchCustom";

class SignUpDiabetesDetailsTwoScreen extends PureComponent {
  state = {};

  onPressContinue = () => {
    const { navigateSignUpActivateAccount } = this.props;
    navigateSignUpActivateAccount();
  };

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <StyleProvider style={getTheme(commonColor)}>
          <Container>
            <View style={{ flex: 1, margin: 16 }}>
              <View>
                <TextSignUpMidTitle title="Tell us a little about yourself." />

                <View>
                  <DatePickerCustom placeholder="Birthday" />
                  <DatePickerCustom placeholder="Diagnosis Date" />
                </View>

                <HrCustom />

                <View>
                  <TextSignUpMidTitle title="Donate Your Data." />
                  <SwitchCustom />
                </View>
              </View>
              <View>
                <Text
                  style={{
                    color: "#7e98c3",
                    fontSize: 16,
                    lineHeight: 24,
                    marginTop: 20,
                  }}
                >
                  You own your data. Read all the details about Tidepool’s Big
                  Data Donation project here.
                </Text>
              </View>

              
              <View>
                <Text>Data Donation Org Choice Dropdown Here Here Here</Text>
              </View>

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

SignUpDiabetesDetailsTwoScreen.propTypes = {
  navigateSignUpActivateAccount: PropTypes.func.isRequired,
};

export default SignUpDiabetesDetailsTwoScreen;
