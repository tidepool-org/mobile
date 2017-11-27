import React, { Component } from "react";
import PropTypes from "prop-types";
import { ViewPropTypes, SafeAreaView } from "react-native";
import glamorous, { withTheme } from "glamorous-native";

import Colors from "../constants/Colors";
import DrawerHealth from "./DrawerHealth";
import DrawerCurrentUser from "./DrawerCurrentUser";
import DrawerSwitchProfileButton from "./DrawerSwitchProfileButton";
import DrawerSupportButton from "./DrawerSupportButton";
import DrawerPrivacyAndTermsButton from "./DrawerPrivacyAndTermsButton";
import DrawerSignOutButton from "./DrawerSignOutButton";
import Divider from "./Divider";

class Drawer extends Component {
  render() {
    return (
      <SafeAreaView
        style={[this.props.style, { backgroundColor: Colors.veryLightGrey }]}
      >
        <glamorous.SectionList
          scrollEnabled={false}
          sections={[
            {
              data: [
                {
                  currentUser: this.props.currentUser,
                  key: "currentUser",
                },
              ],
              renderItem: () => <DrawerCurrentUser />,
            },
            {
              data: [
                {
                  key: "health",
                },
              ],
              renderItem: () => <DrawerHealth />,
            },
            {
              data: [{ key: "switchProfileButtonDivider" }],
              renderItem: () => <Divider />,
            },
            {
              data: [
                {
                  currentUser: this.props.currentUser,
                  key: "switchProfileButton",
                },
              ],
              renderItem: () => (
                <DrawerSwitchProfileButton navigation={this.props.navigation} />
              ),
            },
            {
              data: [{ key: "switchProfileButtonDivider" }],
              renderItem: () => <Divider />,
            },
            {
              data: [
                { currentUser: this.props.currentUser, key: "supportButton" },
              ],
              renderItem: () => (
                <DrawerSupportButton navigation={this.props.navigation} />
              ),
            },
            {
              data: [{ key: "supportButtonDivider" }],
              renderItem: () => <Divider />,
            },
            {
              data: [
                {
                  currentUser: this.props.currentUser,
                  key: "privacyAndTermsButton",
                },
              ],
              renderItem: () => (
                <DrawerPrivacyAndTermsButton
                  navigation={this.props.navigation}
                />
              ),
            },
            {
              data: [{ key: "privacyAndTermsButtonDivider" }],
              renderItem: () => <Divider />,
            },
            {
              data: [
                { currentUser: this.props.currentUser, key: "signOutButton" },
              ],
              renderItem: ({ item }) => (
                <DrawerSignOutButton
                  currentUser={item.currentUser}
                  navigation={this.props.navigation}
                />
              ),
            },
            {
              data: [{ key: "signOutButtonDivider" }],
              renderItem: () => <Divider />,
            },
          ]}
        />
      </SafeAreaView>
    );
  }
}

Drawer.propTypes = {
  style: ViewPropTypes.style,
  currentUser: PropTypes.shape({
    username: PropTypes.string.isRequired,
  }).isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
  }).isRequired,
};

Drawer.defaultProps = {
  style: null,
};

export default withTheme(Drawer);
