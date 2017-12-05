import React from "react";
import PropTypes from "prop-types";
import { StatusBar, Text } from "react-native";
import glamorous, { ThemeProvider } from "glamorous-native";

import PrimaryTheme from "../themes/PrimaryTheme";
import Colors from "../constants/Colors";
import HeaderLeft from "../components/HeaderLeft";
import HeaderRight from "../components/HeaderRight";
import EventList from "../components/EventList";

// TODO: redux - profile - need to remove hardcoded profile name ("Jill Jellyfish") and use proper app state from redux

const eventListData = [
  {
    id: "1",
    time: "December 2, 7:00 pm",
    text: "Note text #testing #sitechange",
  },
  {
    id: "2",
    time: "October 26, 2:00 pm",
    text: "#meal Note text 2",
  },
  {
    id: "3",
    time: "July 10, 12:00 pm",
    text: "#exercise #meal Note text 3",
  },
];

class HomeScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const headerStyle = { backgroundColor: Colors.darkPurple };

    return {
      headerStyle,
      headerTitle: (
        <Text
          style={PrimaryTheme.navHeaderTitleStyle}
          allowFontScaling={false}
          numberOfLines={1}
        >
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
      <ThemeProvider theme={PrimaryTheme}>
        <glamorous.View flex={1}>
          <StatusBar barStyle="light-content" />
          <EventList data={eventListData} />
        </glamorous.View>
      </ThemeProvider>
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
