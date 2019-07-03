import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { StatusBar, Text } from "react-native";
import glamorous, { ThemeProvider } from "glamorous-native";

import ProfileList from "../components/ProfileList";
import PrimaryTheme from "../themes/PrimaryTheme";
import Colors from "../constants/Colors";
import { UserPropType } from "../prop-types/user";
import { ProfileListItemPropType } from "../prop-types/profile";

class SwitchProfileScreen extends PureComponent {
  static navigationOptions = () => {
    const headerStyle = { backgroundColor: Colors.darkPurple };

    return {
      drawerLockMode: "locked-closed",
      headerStyle,
      headerTintColor: "white",
      headerTitle: (
        <Text
          style={PrimaryTheme.screenHeaderTitleStyle}
          allowFontScaling={false}
          numberOfLines={1}
        >
          Switch Profile
        </Text>
      ),
      headerRight: (
        <glamorous.View
          style={{
            padding: 10,
            marginRight: 6
          }}
        />
      )
    };
  };

  constructor(props) {
    super(props);

    this.theme = PrimaryTheme;
  }

  componentDidMount() {
    const { profilesFetchAsync, fetching, currentUser } = this.props;
    if (!fetching) {
      profilesFetchAsync({ ...currentUser });
    }
  }

  onPress = user => {
    const {
      currentUser,
      notesSwitchProfileAndFetchAsync,
      navigateGoBack
    } = this.props;

    notesSwitchProfileAndFetchAsync({
      authUser: currentUser,
      profile: user
    });
    navigateGoBack();
  };

  render() {
    const {
      errorMessage,
      fetching,
      profileListData,
      currentUser,
      profilesFetchAsync
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
          />
        </glamorous.View>
      </ThemeProvider>
    );
  }
}

SwitchProfileScreen.propTypes = {
  profileListData: PropTypes.arrayOf(ProfileListItemPropType).isRequired,
  errorMessage: PropTypes.string,
  fetching: PropTypes.bool,
  profilesFetchAsync: PropTypes.func.isRequired,
  notesSwitchProfileAndFetchAsync: PropTypes.func.isRequired,
  currentUser: UserPropType.isRequired,
  navigateGoBack: PropTypes.func.isRequired
};

SwitchProfileScreen.defaultProps = {
  errorMessage: "",
  fetching: false
};

export default SwitchProfileScreen;
