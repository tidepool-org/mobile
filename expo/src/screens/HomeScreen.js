import React from "react";
import PropTypes from "prop-types";
import { Button, StatusBar, Text, View } from "react-native";
import { NavigationActions } from "react-navigation";

import PrimaryTheme from "../themes/PrimaryTheme";
import HeaderLeft from "../components/HeaderLeft";
import HeaderRight from "../components/HeaderRight";

class HomeScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    headerStyle: { backgroundColor: "#281946" },
    headerTitle: (
      <Text style={PrimaryTheme.navHeaderTitleStyle}>Jill Jellyfish</Text>
    ),
    headerTitleStyle: [
      PrimaryTheme.navHeaderTitleStyle,
      { fontFamily: "OpenSans-Light" },
    ],
    headerLeft: <HeaderLeft navigation={navigation} />,
    headerRight: <HeaderRight navigation={navigation} />,
  });

  onPressSignOut = () => {
    this.props.navigation.dispatch(
      NavigationActions.reset({
        index: 0,
        key: null,
        actions: [NavigationActions.navigate({ routeName: "SignIn" })],
      }),
    );
  };

  onPressOpenMenu = () => {
    this.props.navigation.navigate("DrawerOpen");
  };

  render() {
    return (
      <View>
        <StatusBar backgroundColor="blue" barStyle="light-content" />
        <Button onPress={this.onPressSignOut} title="Log out" />
      </View>
    );
  }
}

HomeScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
  }).isRequired,
};

export default HomeScreen;
