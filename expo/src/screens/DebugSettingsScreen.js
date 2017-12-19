import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { StatusBar, SafeAreaView, Modal, StyleSheet } from "react-native";
import glamorous, { ThemeProvider } from "glamorous-native";

import PrimaryTheme from "../themes/PrimaryTheme";
import Colors from "../constants/Colors";
import DebugSettingsEnvironmentList from "../components/DebugSettingsEnvironmentList";

class DebugSettingsScreen extends PureComponent {
  theme = PrimaryTheme;

  renderSeparator = () => (
    <glamorous.View
      height={StyleSheet.hairlineWidth}
      backgroundColor="#CED0CE"
    />
  );

  renderItem = ({ item }) => (
    <glamorous.Text
      style={this.theme.debugSettingsListItemTextStyle}
      marginTop={8}
      marginBottom={8}
    >
      {item.name}
    </glamorous.Text>
  );

  render() {
    const {
      navigateGoBack,
      environmentSignOutAndSetCurrentEnvironmentAsync,
      selectedEnvironment,
    } = this.props;

    return (
      <ThemeProvider theme={this.theme}>
        <Modal
          visible
          animationType="slide"
          onRequestClose={() => {
            navigateGoBack();
          }}
        >
          <StatusBar barStyle="dark-content" />
          <SafeAreaView
            style={[
              {
                flex: 1,
                backgroundColor: Colors.veryLightGrey,
              },
            ]}
          >
            <glamorous.View
              flexDirection="row"
              justifyContent="space-between"
              padding={8}
            >
              <glamorous.TouchableOpacity onPress={navigateGoBack}>
                <glamorous.Image
                  source={require("../../assets/images/modal-close-button.png")}
                  width={32}
                  height={32}
                />
              </glamorous.TouchableOpacity>
              <glamorous.Text style={this.theme.debugSettingsHeaderTitleStyle}>
                Debug Settings
              </glamorous.Text>
              <glamorous.View width={32} height={32} />
            </glamorous.View>
            <DebugSettingsEnvironmentList
              environmentSignOutAndSetCurrentEnvironmentAsync={
                environmentSignOutAndSetCurrentEnvironmentAsync
              }
              selectedEnvironment={selectedEnvironment}
            />
          </SafeAreaView>
        </Modal>
      </ThemeProvider>
    );
  }
}

DebugSettingsScreen.propTypes = {
  navigateGoBack: PropTypes.func.isRequired,
  environmentSignOutAndSetCurrentEnvironmentAsync: PropTypes.func.isRequired,
  selectedEnvironment: PropTypes.string,
};

DebugSettingsScreen.defaultProps = {
  selectedEnvironment: "",
};

export default DebugSettingsScreen;
