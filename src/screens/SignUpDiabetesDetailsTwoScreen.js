import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { SafeAreaView, View, Switch, StyleSheet, Image } from "react-native";

import RNPickerSelect from "react-native-picker-select";
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
  state = {
    donateDataSwitch: false,
  };

  onPressContinue = () => {
    const { navigateSignUpActivateAccount } = this.props;
    navigateSignUpActivateAccount();
  };

  toggleSwitch = value => {
    this.setState({ donateDataSwitch: value})
  }

  render() {

        const placeholder = {
          label: "Select Data Donation Org...",
          value: null,
          color: "#9EA0A4",
        };

        const sports = [
          {
            label: "Football",
            value: "football",
          },
          {
            label: "Baseball",
            value: "baseball",
          },
          {
            label: "Hockey",
            value: "hockey",
          },
        ];

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
                  <SwitchCustom switchText="Donate my anonymized diabetes data" />
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
                <RNPickerSelect
                  placeholder={placeholder}
                  items={sports}
                  onValueChange={value => {
                    this.setState({
                      favSport4: value,
                    });
                  }}
                  style={{
                    ...pickerSelectStyles,
                    iconContainer: {
                      top: 10,
                      right: 12,
                    },
                  }}
                  Icon={() => {
                    return (
                      <View>
                        <Image
                          source={require("../../assets/images/arrow-drop-down-24-px-2x.png")}
                        />
                      </View>
                    );
                  }}
                  onUpArrow={() => {
                    this.inputRefs.firstTextInput.focus();
                  }}
                  onDownArrow={() => {
                    this.inputRefs.favSport1.togglePicker();
                  }}
                  value={this.state.favSport4}
                  useNativeAndroidPickerStyle={false}
                />
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

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'green',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});

SignUpDiabetesDetailsTwoScreen.propTypes = {
  navigateSignUpActivateAccount: PropTypes.func.isRequired,
};

export default SignUpDiabetesDetailsTwoScreen;
