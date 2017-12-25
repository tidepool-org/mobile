import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { StatusBar, Text } from "react-native";
import glamorous, { ThemeProvider } from "glamorous-native";

import ProfileList from "../components/ProfileList";
import PrimaryTheme from "../themes/PrimaryTheme";
import Colors from "../constants/Colors";

class SwitchProfileScreen extends PureComponent {
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

  constructor(props) {
    super(props);

    this.theme = PrimaryTheme;
  }

  componentDidMount() {
    const { profilesFetchAsync, profileListData, fetching } = this.props;
    if (profileListData.length === 0 && !fetching) {
      profilesFetchAsync({ ...this.props.currentUser });
    }
  }

  onPress = user => {
    this.props.profileSet(user);
    this.props.notesFetchAsync({ userId: user.userId });
    this.props.navigateGoBack();
  };

  render() {
    const {
      errorMessage,
      fetching,
      profileListData,
      currentUser,
      profilesFetchAsync,
      profileSet,
    } = this.props;

    return (
      <ThemeProvider theme={this.theme}>
        <glamorous.View flex={1}>
          <StatusBar barStyle="light-content" />
          <ProfileList
            onPress={this.onPress}
            profileListData={profileListData}
            errorMessage={errorMessage}
            fetching={fetching}
            user={currentUser}
            profilesFetchAsync={profilesFetchAsync}
            profileSet={profileSet}
          />
        </glamorous.View>
      </ThemeProvider>
    );
  }
}

SwitchProfileScreen.propTypes = {
  profileListData: PropTypes.arrayOf(
    PropTypes.shape({
      currentUserId: PropTypes.string.isRequired,
      selectedProfileUserId: PropTypes.string.isRequired,
      userId: PropTypes.string.isRequired,
      fullName: PropTypes.string.isRequired,
    })
  ).isRequired,
  errorMessage: PropTypes.string,
  fetching: PropTypes.bool,
  profilesFetchAsync: PropTypes.func.isRequired,
  notesFetchAsync: PropTypes.func.isRequired,
  profileSet: PropTypes.func.isRequired,
  currentUser: PropTypes.shape({
    userId: PropTypes.string.isRequired,
    fullName: PropTypes.string.isRequired,
  }).isRequired,
  navigateGoBack: PropTypes.func.isRequired,
};

SwitchProfileScreen.defaultProps = {
  errorMessage: "",
  fetching: false,
};

export default SwitchProfileScreen;
