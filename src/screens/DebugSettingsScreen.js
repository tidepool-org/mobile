import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { StatusBar, SafeAreaView, Modal } from "react-native";
import glamorous, { ThemeProvider } from "glamorous-native";

import PrimaryTheme from "../themes/PrimaryTheme";
import Colors from "../constants/Colors";
import DebugSettingsApiEnvironmentList from "../components/DebugSettingsApiEnvironmentList";
import DebugSettingsGraphRendererList from "../components/DebugSettingsGraphRendererList";
// import DebugSettingsLoggingList from "../components/DebugSettingsLoggingList";
import DebugSettingsOtherList from "../components/DebugSettingsOtherList";

class DebugSettingsScreen extends PureComponent {
  constructor(props) {
    super(props);

    this.theme = PrimaryTheme;
  }

  onApiEnvironmentSelected = newSelectedApiEnvironment => {
    const {
      selectedApiEnvironment,
      apiEnvironmentSetAndSaveAsync,
      navigateGoBack
    } = this.props;

    if (newSelectedApiEnvironment !== selectedApiEnvironment) {
      apiEnvironmentSetAndSaveAsync(newSelectedApiEnvironment);
    } else {
      navigateGoBack();
    }
  };

  onGraphRendererSelected = newSelectedGraphRenderer => {
    const { selectedGraphRenderer, navigateGoBack } = this.props;

    if (newSelectedGraphRenderer !== selectedGraphRenderer) {
      // Delay this so the Modal closes faster
      const { graphRendererSetAndSaveAsync } = this.props;
      setTimeout(() => {
        graphRendererSetAndSaveAsync(newSelectedGraphRenderer);
      }, 250);
    }
    navigateGoBack();
  };

  onLogLevelSelected = newLogLevel => {
    const { selectedLogLevel, navigateGoBack } = this.props;

    if (newLogLevel !== selectedLogLevel) {
      // Delay this so the Modal closes faster
      const { logLevelSetAndSaveAsync } = this.props;
      setTimeout(() => {
        logLevelSetAndSaveAsync(newLogLevel);
      }, 250);
    }
    navigateGoBack();
  };

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
      firstTimeTipsResetTips,
      selectedApiEnvironment,
      selectedGraphRenderer
      // selectedLogLevel,
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
              backgroundColor: Colors.veryLightGrey
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
              <glamorous.View
                flexDirection="row"
                justifyContent="space-between"
                padding={8}
              />
              {/*
                <DebugSettingsLoggingList
                  onLogLevelSelected={this.onLogLevelSelected}
                  selectedLogLevel={selectedLogLevel}
                />
                */}
              <glamorous.View
                flexDirection="row"
                justifyContent="space-between"
                padding={8}
              />
              <DebugSettingsOtherList
                navigateGoBack={navigateGoBack}
                firstTimeTipsResetTips={firstTimeTipsResetTips}
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
  selectedApiEnvironment: PropTypes.string,
  firstTimeTipsResetTips: PropTypes.func.isRequired,
  graphRendererSetAndSaveAsync: PropTypes.func.isRequired,
  selectedGraphRenderer: PropTypes.string,
  logLevelSetAndSaveAsync: PropTypes.func.isRequired,
  selectedLogLevel: PropTypes.string
};

DebugSettingsScreen.defaultProps = {
  selectedApiEnvironment: "",
  selectedGraphRenderer: "",
  selectedLogLevel: ""
};

export default DebugSettingsScreen;
