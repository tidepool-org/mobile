import React from "react";
import PropTypes from "prop-types";
import { StatusBar, Text } from "react-native";
import glamorous from "glamorous-native";

import PrimaryTheme from "../themes/PrimaryTheme";
import Colors from "../constants/Colors";
import HeaderLeft from "../components/HeaderLeft";
import HeaderRight from "../components/HeaderRight";

// TODO: redux - profile - need to remove hardcoded profile name ("Jill Jellyfish") and use proper app state from redux

class HomeScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const headerStyle = { backgroundColor: Colors.darkPurple };

    return {
      headerStyle,
      headerTitle: (
        <Text style={PrimaryTheme.navHeaderTitleStyle} allowFontScaling={false}>
          Jill Jellyfish
        </Text>
      ),
      headerLeft: <HeaderLeft navigation={navigation} />,
      headerRight: <HeaderRight navigation={navigation} />,
    };
  };

  onPressOpenMenu = () => {
    this.props.navigation.navigate("DrawerOpen");
  };

  render() {
    return (
      <glamorous.View flex={1} alignItems="center">
        <StatusBar barStyle="light-content" />
      </glamorous.View>
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
