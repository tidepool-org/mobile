import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { SafeAreaView, View } from "react-native";

import {
  StyleProvider,
  Container,
  Text,
  Button,
  DatePicker,
  ListItem,
  Body,
  Switch,
 } from "native-base";
import getTheme from "../../native-base-theme/components";
import commonColor from "../../native-base-theme/variables/commonColor";

import TextSignUpMidTitle from "../components/TextSignUpMidTitle";
import HrCustom from "../components/HrCustom";

class SignUpDiabetesDetailsTwoScreen extends PureComponent {
  state = {
  };

  constructor(props) {
    super(props);
    this.state = { chosenDate: new Date() };
    this.setDate = this.setDate.bind(this);
  }

  setDate(newDate) {
    this.setState({ chosenDate: newDate });
  }

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
              <TextSignUpMidTitle title="Tell us a little about yourself." />

              <View>
                <DatePicker
                  defaultDate={new Date(2018, 4, 4)}
                  minimumDate={new Date(2018, 1, 1)}
                  maximumDate={new Date(2018, 12, 31)}
                  locale="en"
                  timeZoneOffsetInMinutes={undefined}
                  modalTransparent={false}
                  animationType="fade"
                  androidMode="default"
                  placeHolderText="Birthday"
                  textStyle={{ color: "green" }}
                  placeHolderTextStyle={{ color: "#d3d3d3" }}
                  onDateChange={this.setDate}
                  disabled={false}
                  returnKeyType="done"
                />
                <Text>
                  Date:
                  {this.state.chosenDate.toString().substr(4, 12)}
                </Text>
              </View>

              <View>
                <DatePicker
                  defaultDate={new Date(2018, 4, 4)}
                  minimumDate={new Date(2018, 1, 1)}
                  maximumDate={new Date(2018, 12, 31)}
                  locale="en"
                  timeZoneOffsetInMinutes={undefined}
                  modalTransparent={false}
                  animationType="fade"
                  androidMode="default"
                  placeHolderText="Diagnosis Date"
                  textStyle={{ color: "green" }}
                  placeHolderTextStyle={{ color: "#d3d3d3" }}
                  onDateChange={this.setDate}
                  disabled={false}
                />
                <Text>
                  Date:
                  {this.state.chosenDate.toString().substr(4, 12)}
                </Text>
              </View>
              <HrCustom />
              <View>
                <TextSignUpMidTitle title="Donate Your Data." />
                <ListItem>
                  <Switch value={false} />
                  <Body>
                    <Text>Donate my anonymized diabetes data</Text>
                  </Body>
                </ListItem>
                <Text>You own your data. Read all the details about Tidepool’s Big Data Donation project here.</Text>
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
