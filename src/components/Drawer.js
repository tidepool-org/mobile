import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { ViewPropTypes, SafeAreaView } from "react-native";
import glamorous, { ThemeProvider } from "glamorous-native";

import PrimaryTheme from "../themes/PrimaryTheme";
import Colors from "../constants/Colors";
import DrawerHealth from "./DrawerHealth";
import DrawerCurrentUser from "./DrawerCurrentUser";
import DrawerSwitchProfileButton from "./DrawerSwitchProfileButton";
import DrawerHealthSyncButton from "./DrawerHealthSyncButton";
import DrawerSupportButton from "./DrawerSupportButton";
import DrawerPrivacyAndTermsButton from "./DrawerPrivacyAndTermsButton";
import DrawerSignOutButton from "./DrawerSignOutButton";
import Divider from "./Divider";
import DebugSettingsTouchable from "./DebugSettingsTouchable";
import VersionAndApiEnvironment from "./VersionAndApiEnvironment";
import { UserPropType } from "../prop-types/user";

class Drawer extends PureComponent {
  theme = PrimaryTheme;

  render() {
    const {
      style,
      version,
      apiEnvironment,
      currentUser,
      health,
      navigateDebugSettings,
      navigateDrawerClose,
      navigateHealthSync,
      notesSwitchProfileAndFetchAsync,
      navigateSwitchProfile,
      navigateSupport,
      navigatePrivacyAndTerms,
      authSignOutAsync,
    } = this.props;

    return (
      <ThemeProvider theme={this.theme}>
        <SafeAreaView
          style={[style, { backgroundColor: Colors.veryLightGrey }]}
        >
          <glamorous.SectionList
            scrollEnabled={false}
            sections={[
              {
                data: [
                  {
                    currentUser,
                    key: "currentUser",
                  },
                ],
                renderItem: ({ item }) => (
                  <DrawerCurrentUser
                    navigateDrawerClose={navigateDrawerClose}
                    notesSwitchProfileAndFetchAsync={
                      notesSwitchProfileAndFetchAsync
                    }
                    currentUser={item.currentUser}
                  />
                ),
              },
              {
                data: [
                  {
                    currentUser,
                    key: "health",
                  },
                ],
                renderItem: ({ item }) => (
                  <DrawerHealth
                    currentUser={item.currentUser}
                    health={health}
                  />
                ),
              },
              {
                data: [{ key: "healthSyncButtonDivider" }],
                renderItem: () =>
                  health.healthKitInterfaceEnabledForCurrentUser ? (
                    <Divider />
                  ) : null,
              },
              {
                data: [
                  {
                    currentUser,
                    key: "health-sync",
                  },
                ],
                renderItem: () =>
                  health.healthKitInterfaceEnabledForCurrentUser ? (
                    <DrawerHealthSyncButton
                      navigateHealthSync={navigateHealthSync}
                      navigateDrawerClose={navigateDrawerClose}
                    />
                  ) : null,
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
                    navigateSwitchProfile={navigateSwitchProfile}
                    navigateDrawerClose={navigateDrawerClose}
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
                  <DrawerSupportButton navigateSupport={navigateSupport} />
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
                    navigatePrivacyAndTerms={navigatePrivacyAndTerms}
                  />
                ),
              },
              {
                data: [{ key: "privacyAndTermsButtonDivider" }],
                renderItem: () => <Divider />,
              },
              {
                data: [{ currentUser, key: "signOutButton" }],
                renderItem: ({ item }) => (
                  <DrawerSignOutButton
                    currentUser={item.currentUser}
                    authSignOutAsync={authSignOutAsync}
                  />
                ),
              },
              {
                data: [{ key: "signOutButtonDivider" }],
                renderItem: () => <Divider />,
              },
            ]}
          />
          <DebugSettingsTouchable
            style={{
              bottom: 15,
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
            navigateDebugSettings={navigateDebugSettings}
          >
            <VersionAndApiEnvironment
              version={version}
              apiEnvironment={apiEnvironment}
              small
            />
          </DebugSettingsTouchable>
        </SafeAreaView>
      </ThemeProvider>
    );
  }
}

Drawer.propTypes = {
  style: ViewPropTypes.style,
  health: PropTypes.object.isRequired,
  navigateDrawerClose: PropTypes.func.isRequired,
  navigateHealthSync: PropTypes.func.isRequired,
  notesSwitchProfileAndFetchAsync: PropTypes.func.isRequired,
  navigateSwitchProfile: PropTypes.func.isRequired,
  navigateSupport: PropTypes.func.isRequired,
  navigatePrivacyAndTerms: PropTypes.func.isRequired,
  navigateDebugSettings: PropTypes.func.isRequired,
  authSignOutAsync: PropTypes.func.isRequired,
  currentUser: UserPropType.isRequired,
  version: PropTypes.string.isRequired,
  apiEnvironment: PropTypes.string.isRequired,
};

Drawer.defaultProps = {
  style: null,
};

export default Drawer;
