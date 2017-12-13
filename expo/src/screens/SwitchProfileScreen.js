import React, { Component } from "react";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { StatusBar, Text } from "react-native";
import glamorous, { ThemeProvider } from "glamorous-native";

import ProfileList from "../components/ProfileList";
import PrimaryTheme from "../themes/PrimaryTheme";
import Colors from "../constants/Colors";
import { navigateGoBack } from "../actions/navigation";

// TODO: redux - profile list - need to remove hardcoded profile list and use proper app state from redux

const items = [
  {
    currentUserId: "1",
    selectedProfileUserId: "2",
    profile: {
      userid: "1",
      fullname: "Current User",
    },
  },
  {
    currentUserId: "1",
    selectedProfileUserId: "2",
    profile: {
      userid: "2",
      fullname: "Jill Jellyfish",
    },
  },
  {
    currentUserId: "1",
    selectedProfileUserId: "2",
    profile: {
      userid: "3",
      fullname: "Jill Jellyfish the Second",
    },
  },
];

class SwitchProfileScreen extends Component {
  static navigationOptions = () => {
    const headerStyle = { backgroundColor: Colors.darkPurple };

    return {
      headerStyle,
      headerTintColor: "white",
      headerTitle: (
        <Text
          style={PrimaryTheme.navHeaderTitleStyle}
          allowFontScaling={false}
          numberOfLines={1}
        >
          Switch Profile
        </Text>
      ),
    };
  };

  onPress = () => {
    // TODO: profile - switch profile when selecting profile from list and navigating back
    this.props.navigateGoBack();
  };

  render() {
    return (
      <ThemeProvider theme={PrimaryTheme}>
        <glamorous.View flex={1}>
          <StatusBar barStyle="light-content" />
          <ProfileList onPress={this.onPress} items={items} />
        </glamorous.View>
      </ThemeProvider>
    );
  }
}

SwitchProfileScreen.propTypes = {
  navigateGoBack: PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      navigateGoBack,
    },
    dispatch,
  );
}

export default connect(null, mapDispatchToProps)(SwitchProfileScreen);
