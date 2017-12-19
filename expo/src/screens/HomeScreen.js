import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { StatusBar } from "react-native";
import glamorous, { ThemeProvider } from "glamorous-native";

import PrimaryTheme from "../themes/PrimaryTheme";
import Colors from "../constants/Colors";
import HeaderTitleContainer from "../containers/HeaderTitleContainer";
import HeaderLeftContainer from "../containers/HeaderLeftContainer";
import HeaderRight from "../components/HeaderRight";
import EventList from "../components/EventList";

class HomeScreen extends PureComponent {
  static navigationOptions = () => {
    const headerStyle = { backgroundColor: Colors.darkPurple };

    return {
      headerStyle,
      headerTitle: <HeaderTitleContainer />,
      headerLeft: <HeaderLeftContainer />,
      headerRight: <HeaderRight />,
    };
  };

  theme = PrimaryTheme;

  render() {
    const { eventListData } = this.props;

    return (
      <ThemeProvider theme={this.theme}>
        <glamorous.View flex={1}>
          <StatusBar barStyle="light-content" />
          <EventList data={eventListData} />
        </glamorous.View>
      </ThemeProvider>
    );
  }
}

HomeScreen.propTypes = {
  eventListData: PropTypes.arrayOf(
    PropTypes.shape({
      time: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

export default HomeScreen;
