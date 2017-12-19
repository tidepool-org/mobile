import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { ViewPropTypes, SafeAreaView } from "react-native";
import glamorous, { ThemeProvider } from "glamorous-native";

import PrimaryTheme from "../themes/PrimaryTheme";
import Colors from "../constants/Colors";
import DrawerHealth from "./DrawerHealth";
import DrawerCurrentUser from "./DrawerCurrentUser";
import DrawerSwitchProfileButton from "./DrawerSwitchProfileButton";
import DrawerSupportButton from "./DrawerSupportButton";
import DrawerPrivacyAndTermsButton from "./DrawerPrivacyAndTermsButton";
import DrawerSignOutButton from "./DrawerSignOutButton";
import Divider from "./Divider";

class Drawer extends PureComponent {
  theme = PrimaryTheme;

  render() {
    return (
      <ThemeProvider theme={this.theme}>
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
                renderItem: ({ item }) => (
                  <DrawerCurrentUser
                    navigateDrawerClose={this.props.navigateDrawerClose}
                    currentUser={item.currentUser}
                  />
                ),
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
                    key: "switchProfileButton",
                  },
                ],
                renderItem: () => (
                  <DrawerSwitchProfileButton
                    navigateSwitchProfile={this.props.navigateSwitchProfile}
                  />
                ),
              },
              {
                data: [{ key: "switchProfileButtonDivider" }],
                renderItem: () => <Divider />,
              },
              {
                data: [{ key: "supportButton" }],
                renderItem: () => (
                  <DrawerSupportButton
                    navigateSupport={this.props.navigateSupport}
                  />
                ),
              },
              {
                data: [{ key: "supportButtonDivider" }],
                renderItem: () => <Divider />,
              },
              {
                data: [
                  {
                    key: "privacyAndTermsButton",
                  },
                ],
                renderItem: () => (
                  <DrawerPrivacyAndTermsButton
                    navigatePrivacyAndTerms={this.props.navigatePrivacyAndTerms}
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
                    authSignOutAsync={this.props.authSignOutAsync}
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
      </ThemeProvider>
    );
  }
}

Drawer.propTypes = {
  style: ViewPropTypes.style,
  currentUser: PropTypes.shape({
    username: PropTypes.string.isRequired,
    fullName: PropTypes.string.isRequired,
  }).isRequired,
  navigateDrawerClose: PropTypes.func.isRequired,
  navigateSwitchProfile: PropTypes.func.isRequired,
  navigateSupport: PropTypes.func.isRequired,
  navigatePrivacyAndTerms: PropTypes.func.isRequired,
  authSignOutAsync: PropTypes.func.isRequired,
};

Drawer.defaultProps = {
  style: null,
};

export default Drawer;
