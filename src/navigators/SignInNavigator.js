import React from "react";
import { Text } from "react-native";
import { createStackNavigator } from "react-navigation";
import glamorous from "glamorous-native";

import SignInScreenContainer from "../containers/SignInScreenContainer";
import SignUpScreenContainer from "../containers/SignUpScreenContainer";
import SignUpCreateAccountScreenContainer from "../containers/SignUpCreateAccountScreenContainer";
import SignUpTermsOfUseScreenContainer from "../containers/SignUpTermsOfUseScreenContainer";
import SignUpDiabetesDetailsScreenContainer from "../containers/SignUpDiabetesDetailsScreenContainer";
import SignUpActivateAccountScreenContainer from "../containers/SignUpActivateAccountScreenContainer";
import {
  SIGN_IN_ROUTE_NAME,
  SIGN_UP_ROUTE_NAME,
  SIGN_UP_CREATE_ACCOUNT_ROUTE_NAME,
  SIGN_UP_TERMS_OF_USE_ROUTE_NAME,
  SIGN_UP_DIABETES_DETAILS_ROUTE_NAME,
  SIGN_UP_ACTIVATE_ACCOUNT_ROUTE_NAME,
} from "./routeNames";
import Colors from "../constants/Colors";
import PrimaryTheme from "../themes/PrimaryTheme";

function createNavigationOptions({ title, headerHeight }) {
  return () => {
    const navigationOptions = {
      headerHeight: 0,
      headerStyle: {
        backgroundColor: Colors.darkPurple,
      },
      headerTintColor: "white",
      headerTitle: (
        <Text
          style={PrimaryTheme.screenHeaderTitleStyle}
          allowFontScaling={false}
          numberOfLines={1}
        >
          {title}
        </Text>
      ),
      headerRight: (
        <glamorous.View
          style={{
            padding: 10,
            marginRight: 6,
          }}
        />
      ),
    };
    if (headerHeight !== undefined) {
      navigationOptions.headerStyle.height = 0;
    }

    return navigationOptions;
  };
}

const SignInNavigator = createStackNavigator(
  {
    [SIGN_IN_ROUTE_NAME]: {
      screen: props => <SignInScreenContainer {...props} />,
      navigationOptions: createNavigationOptions({ headerHeight: 0 }),
    },
    [SIGN_UP_ROUTE_NAME]: {
      screen: props => <SignUpScreenContainer {...props} />,
      navigationOptions: createNavigationOptions({
        title: "Sign up for Tidepool",
      }),
    },
    [SIGN_UP_CREATE_ACCOUNT_ROUTE_NAME]: {
      screen: props => <SignUpCreateAccountScreenContainer {...props} />,
      navigationOptions: createNavigationOptions({
        title: "Create account",
      }),
    },
    [SIGN_UP_TERMS_OF_USE_ROUTE_NAME]: {
      screen: props => <SignUpTermsOfUseScreenContainer {...props} />,
      navigationOptions: createNavigationOptions({
        title: "Terms of use",
      }),
    },
    [SIGN_UP_DIABETES_DETAILS_ROUTE_NAME]: {
      screen: props => <SignUpDiabetesDetailsScreenContainer {...props} />,
      navigationOptions: createNavigationOptions({
        title: "Diabetes details",
      }),
    },
    [SIGN_UP_ACTIVATE_ACCOUNT_ROUTE_NAME]: {
      screen: props => <SignUpActivateAccountScreenContainer {...props} />,
      navigationOptions: createNavigationOptions({
        title: "Activate your account",
      }),
    },
  },
  {
    headerMode: "float",
    headerTransitionPreset: "uikit",
    headerBackTitle: "",
    headerTruncatedBackTitle: "",
  }
);

export { SignInNavigator };
