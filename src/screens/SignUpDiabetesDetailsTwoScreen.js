import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { SafeAreaView, View, Switch } from "react-native";

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

                  <View style={{ display: "flex" }}>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Switch
                        trackColor={{ true: "#627cff" }}
                        onValueChange={this.toggleSwitch}
                        value={this.state.donateDataSwitch}
                      />
                      <Text
                        style={{
                          color: "#4f6a92",
                          fontSize: 16,
                          marginLeft: 10,
                        }}
                      >
                        Donate my anonymized diabetes data
                      </Text>
                    </View>
                  </View>
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
                    iconContainer: {
                      top: 10,
                      right: 12,
                    },
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

SignUpDiabetesDetailsTwoScreen.propTypes = {
  navigateSignUpActivateAccount: PropTypes.func.isRequired,
};

export default SignUpDiabetesDetailsTwoScreen;
