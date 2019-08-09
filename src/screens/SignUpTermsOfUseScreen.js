import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { SafeAreaView, View } from "react-native";

import {
  StyleProvider,
  Container,
  Text,
  Button,
  ListItem,
  Left,
  Right,
  Radio,
} from "native-base";

import getTheme from "../../native-base-theme/components";
import commonColor from "../../native-base-theme/variables/commonColor";

import { TextSignUpMidTitle } from "../components/TextSignUpMidTitle";
import { SwitchCustom } from "../components/SwitchCustom";

class SignUpTermsOfUseScreen extends PureComponent {
  state = {};

  onPressContinue = () => {
    const { navigateSignUpDiabetesDetails } = this.props;
    navigateSignUpDiabetesDetails();
  };

  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
        <StyleProvider style={getTheme(commonColor)}>
          <Container>
            <View style={{ flex: 1, margin: 16 }}>
              <View>
                <TextSignUpMidTitle title="Select your age." />
                <ListItem>
                  <Left>
                    <Text>I am 18 years or older</Text>
                  </Left>
                  <Right>
                    <Radio true />
                  </Right>
                </ListItem>

                <ListItem>
                  <Left>
                    <Text>I am between 13 and 17 years old</Text>
                  </Left>
                  <Right>
                    <Radio selected={false} />
                  </Right>
                </ListItem>

                <ListItem>
                  <Left>
                    <Text>I am 12 years old or younger</Text>
                  </Left>
                  <Right>
                    <Radio selected={false} />
                  </Right>
                </ListItem>
              </View>
              <View>
                <TextSignUpMidTitle title="Acknowledge terms of use." />
                <SwitchCustom switchText="I am 18 or older and accept the terms of the Tidepool App Terms of Use and Privacy Policy" />
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

SignUpTermsOfUseScreen.propTypes = {
  navigateSignUpDiabetesDetails: PropTypes.func.isRequired,
  // navigatePrivacyAndTerms: PropTypes.func.isRequired, // TODO: call this when tapping on link
};

export default SignUpTermsOfUseScreen;
