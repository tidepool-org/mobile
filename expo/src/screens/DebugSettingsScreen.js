import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { StatusBar, SafeAreaView, Modal, StyleSheet } from "react-native";
import glamorous, { ThemeProvider } from "glamorous-native";

import PrimaryTheme from "../themes/PrimaryTheme";
import Colors from "../constants/Colors";
import DebugSettingsApiEnvironmentList from "../components/DebugSettingsApiEnvironmentList";
import DebugSettingsGraphRendererList from "../components/DebugSettingsGraphRendererList";

class DebugSettingsScreen extends PureComponent {
  constructor(props) {
    super(props);

    this.theme = PrimaryTheme;
  }

  onApiEnvironmentSelected = selectedApiEnvironment => {
    if (selectedApiEnvironment !== this.props.selectedApiEnvironment) {
      this.props.apiEnvironmentSetAndSaveAsync(selectedApiEnvironment);
    } else {
      this.props.navigateGoBack();
    }
  };

  onGraphRendererSelected = selectedGraphRenderer => {
    if (selectedGraphRenderer !== this.props.selectedGraphRenderer) {
      this.props.graphRendererSetAndSaveAsync(selectedGraphRenderer);
    }
    this.props.navigateGoBack();
  };

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
      selectedApiEnvironment,
      selectedGraphRenderer,
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
            style={{
              flex: 1,
              backgroundColor: Colors.veryLightGrey,
            }}
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
            <glamorous.ScrollView>
              <DebugSettingsApiEnvironmentList
                onApiEnvironmentSelected={this.onApiEnvironmentSelected}
                selectedApiEnvironment={selectedApiEnvironment}
              />
              <glamorous.View
                flexDirection="row"
                justifyContent="space-between"
                padding={8}
              />
              <DebugSettingsGraphRendererList
                onGraphRendererSelected={this.onGraphRendererSelected}
                selectedGraphRenderer={selectedGraphRenderer}
              />
            </glamorous.ScrollView>
          </SafeAreaView>
        </Modal>
      </ThemeProvider>
    );
  }
}

DebugSettingsScreen.propTypes = {
  navigateGoBack: PropTypes.func.isRequired,
  apiEnvironmentSetAndSaveAsync: PropTypes.func.isRequired,
  graphRendererSetAndSaveAsync: PropTypes.func.isRequired,
  selectedApiEnvironment: PropTypes.string,
  selectedGraphRenderer: PropTypes.string,
};

DebugSettingsScreen.defaultProps = {
  selectedApiEnvironment: "",
  selectedGraphRenderer: "",
};

export default DebugSettingsScreen;
