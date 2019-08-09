import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { SafeAreaView, View, Alert } from "react-native";

import {
  StyleProvider,
  Container,
  Text,
  Button,
  Form,
  Item,
  Picker,
} from "native-base";
import getTheme from "../../native-base-theme/components";
import commonColor from "../../native-base-theme/variables/commonColor";

import { TextSignUpMidTitle } from "../components/TextSignUpMidTitle";
import { ButtonWithLongText } from "../components/ButtonWithLongText";
import { HrCustom } from "../components/HrCustom";

class SignUpDiabetesDetailsScreen extends PureComponent {
  state = {};

  onPressDiabetesDetailsTwo = () => {
    const { navigateSignUpDiabetesDetailsTwo } = this.props;
    navigateSignUpDiabetesDetailsTwo();
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
              <TextSignUpMidTitle title="Whose diabetes data will you be managing?" />
              <ButtonWithLongText
                title="This is for me, I have diabetes"
                onPress={this.showAlert}
              />
              <ButtonWithLongText
                title="This is for someone I care for who has diabetes"
                onPress={this.showAlert}
              />

              <HrCustom />

              <Form style={{ flex: 1, margin: 16 }}>
                <Item picker>
                  <Picker
                    mode="dropdown"
                    placeholder="I have / They have..."
                    placeholderStyle={{ color: "#bfc6ea" }}
                    placeholderIconColor="#007aff"
                  >
                    <Picker.Item label="Type 1 Diabetes" value="key0" />
                    <Picker.Item label="Type 2 Diabetes" value="key1" />
                    <Picker.Item label="Gestational Diabetes" value="key2" />
                    <Picker.Item label="LADA" value="key3" />
                  </Picker>
                </Item>
              </Form>

              <View style={{ flex: 1, justifyContent: "flex-end" }}>
                <Button block onPress={this.onPressDiabetesDetailsTwo}>
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
  navigateSignUpDiabetesDetailsTwo: PropTypes.func.isRequired,
};

export default SignUpDiabetesDetailsScreen;
