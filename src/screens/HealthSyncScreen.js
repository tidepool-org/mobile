import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import {
  Alert,
  ProgressViewIOS,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { ThemeProvider } from "glamorous-native";

import PrimaryTheme from "../themes/PrimaryTheme";
import { TPNativeHealth } from "../models/TPNativeHealth";
import Button from "../components/Button";

import Colors from "../constants/Colors";

const styles = StyleSheet.create({
  headerRight: {
    padding: 10,
    marginRight: 6,
  },
  introView: {
    padding: 20,
  },
  introSyncPrimaryText: {
    width: 275,
    paddingTop: 20,
    alignSelf: "center",
    textAlign: "center",
    ...PrimaryTheme.healthSyncTextPrimary,
  },
  introInitialSyncSecondaryText: {
    width: 275,
    paddingTop: 20,
    alignSelf: "center",
    textAlign: "center",
    ...PrimaryTheme.healthSyncTextSecondary,
  },
  introManualSyncSecondaryText: {
    paddingTop: 20,
    paddingBottom: 40,
    alignSelf: "center",
    textAlign: "center",
    ...PrimaryTheme.healthSyncTextSecondary,
  },
  syncProgressText: {
    marginTop: 10,
    alignSelf: "center",
    ...PrimaryTheme.healthSyncTextSecondary,
  },
  syncProgressBarView: {
    padding: 10,
    width: 300,
    alignSelf: "center",
  },
  syncProgressExplanation: {
    width: 300,
    alignSelf: "center",
    paddingBottom: 20,
    ...PrimaryTheme.healthSyncTextSecondary,
  },
});

class HealthSyncScreen extends PureComponent {
  static navigationOptions = ({
    navigation: {
      state: {
        params: { isInitialSync },
      },
    },
  }) => {
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
          {isInitialSync ? "Initial Sync" : "Manual Sync"}
        </Text>
      ),
      headerRight: <View style={styles.headerRight} />,
    };
  };

  state = {
    shouldShowSyncStatus: false,
  };

  componentDidMount() {
    const {
      healthKitInterfaceSet,
      health: { isUploadingHistorical },
    } = this.props;

    TPNativeHealth.setHasPresentedSyncUI();
    healthKitInterfaceSet({
      hasPresentedSyncUI: true,
    });

    if (isUploadingHistorical) {
      this.setState({
        shouldShowSyncStatus: true,
      });
    }
  }

  static getDerivedStateFromProps(props) {
    const {
      health: { isUploadingHistorical },
    } = props;

    if (isUploadingHistorical) {
      return {
        shouldShowSyncStatus: true,
      };
    }

    return null;
  }

  onPressCancelOrContinue = () => {
    const {
      navigateGoBack,
      health: { isUploadingHistorical },
    } = this.props;

    if (isUploadingHistorical) {
      Alert.alert("Stop Syncing?", null, [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            TPNativeHealth.stopUploadingHistorical();
            navigateGoBack();
          },
        },
      ]);
    } else {
      TPNativeHealth.stopUploadingHistorical();
      navigateGoBack();
    }
  };

  onPressSync = () => {
    TPNativeHealth.stopUploadingHistorical(); // Reset uploader state so historical upload starts from beginning
    TPNativeHealth.startUploadingHistorical();

    // Schedule this for next tick so it coalesces with other dispatched state
    // changes that might have occurred above, to avoid a flash of complete or
    // error status from previous sync
    setImmediate(() => {
      this.setState({
        shouldShowSyncStatus: true,
      });
    });
  };

  static renderBulletedTextView(text) {
    return (
      <View style={{ flexDirection: "row" }}>
        <Text style={PrimaryTheme.healthSyncTextSecondary}>{"\u2022"}</Text>
        <Text
          style={{
            ...PrimaryTheme.healthSyncTextSecondary,
            flex: 1,
            paddingLeft: 5,
          }}
        >
          {text}
        </Text>
      </View>
    );
  }

  renderSyncProgress() {
    const {
      health: {
        isUploadingHistorical,
        historicalUploadCurrentDay,
        historicalUploadTotalDays,
        turnOffUploaderReason,
        turnOffUploaderError,
      },
    } = this.props;

    let syncProgressText = "";
    let progress = 0;
    // TODO: health -  Revisit this temporary work around for an issue where
    // upload stats show 1 of 1 days before determining true total number of
    // days!
    if (
      (isUploadingHistorical || turnOffUploaderReason) &&
      historicalUploadTotalDays > 1
    ) {
      syncProgressText = `Day ${historicalUploadCurrentDay} of ${historicalUploadTotalDays}`;
      progress = historicalUploadCurrentDay / historicalUploadTotalDays;
    }
    let syncErrorText = turnOffUploaderError;

    // Ensure that the text contents has at least the numberOfLines specified in
    // the text so that enough space is reserved in layout regardless of text
    // contents so that layout doesn't jump around
    syncProgressText = `${syncProgressText}\n `;
    syncErrorText = `${syncErrorText}\n \n \n \n `;

    return (
      <View style={styles.syncProgressBarView}>
        <ProgressViewIOS
          progressTintColor={PrimaryTheme.progressTintColor}
          trackTintColor={PrimaryTheme.trackTintColor}
          progress={progress}
        />
        <View>
          <Text style={styles.syncProgressText} numberOfLines={1}>
            {syncProgressText}
          </Text>
        </View>
        <View>
          <Text style={styles.syncProgressText} numberOfLines={4}>
            {syncErrorText}
          </Text>
        </View>
      </View>
    );
  }

  renderSyncStatus() {
    const {
      health: { turnOffUploaderReason },
    } = this.props;

    let primaryText = "";
    let syncProgressExplanation = "";
    let buttonTitle = "";
    if (turnOffUploaderReason === "complete") {
      primaryText = "Sync Complete";
      buttonTitle = "Continue";
    } else if (turnOffUploaderReason === "error") {
      primaryText = "Sync Error";
      buttonTitle = "Continue";
    } else {
      primaryText = "Syncing Now";
      syncProgressExplanation =
        "Please stay on this screen and keep your phone unlocked while we sync.";
      buttonTitle = "Cancel";
    }

    // Ensure that the text contents has at least the numberOfLines specified in
    // the text so that enough space is reserved in layout regardless of text
    // contents so that layout doesn't jump around
    syncProgressExplanation = `${syncProgressExplanation}\n \n `;

    return (
      <>
        <View style={styles.introView}>
          <Text style={styles.introSyncPrimaryText}>{primaryText}</Text>
        </View>
        {this.renderSyncProgress()}
        <View>
          <Text style={styles.syncProgressExplanation} numberOfLines={2}>
            {syncProgressExplanation}
          </Text>
          <Button
            containerStyle={{ margin: 10 }}
            title={buttonTitle}
            textStyle={PrimaryTheme.toolTipContentButtonTextStyle}
            onPress={this.onPressCancelOrContinue}
          />
        </View>
      </>
    );
  }

  renderInitialSyncIntro() {
    return (
      <>
        <View style={styles.introView}>
          <Text style={styles.introSyncPrimaryText}>
            {`Make Tidepool even\nbetter with Apple Health.`}
          </Text>
          <Text style={styles.introInitialSyncSecondaryText}>
            Automatically sync your diabetes data from your phone to Tidepool.
          </Text>
          <Text style={styles.introManualSyncSecondaryText}>
            We suggest using a manual sync if you are having trouble seeing your
            diabetes data in Tidepool Mobile or on the web.
          </Text>
        </View>
        <View>
          <Button
            containerStyle={{ margin: 10 }}
            title="Sync Health Data"
            textStyle={PrimaryTheme.toolTipContentButtonTextStyle}
            onPress={this.onPressSync}
          />
        </View>
      </>
    );
  }

  renderManualSyncIntro() {
    return (
      <>
        <View style={styles.introView}>
          <Text style={styles.introSyncPrimaryText}>Manual Health Sync</Text>
          <Text style={styles.introManualSyncSecondaryText}>
            We suggest using a manual sync if you are having trouble seeing your
            diabetes data in Tidepool Mobile or on the web.
          </Text>
          <Text style={PrimaryTheme.healthSyncTextSecondary}>
            Before syncing:
          </Text>
          {HealthSyncScreen.renderBulletedTextView("Open the Health app")}
          {HealthSyncScreen.renderBulletedTextView("Tap the Sources tab")}
          {HealthSyncScreen.renderBulletedTextView("Tap Tidepool")}
          {HealthSyncScreen.renderBulletedTextView(
            "Turn on any switches you want to sync with Tidepool (blood glucose, nutrition, insulin, etc)"
          )}
        </View>
        <View>
          <Button
            containerStyle={{ margin: 10 }}
            title="Sync Health Data"
            textStyle={PrimaryTheme.toolTipContentButtonTextStyle}
            onPress={this.onPressSync}
          />
        </View>
      </>
    );
  }

  render() {
    const { isInitialSync } = this.props;
    const { shouldShowSyncStatus } = this.state;

    const shouldShowInitialSyncIntro = !shouldShowSyncStatus && isInitialSync;
    const shouldShowManualSyncIntro = !shouldShowSyncStatus && !isInitialSync;

    return (
      <ThemeProvider theme={PrimaryTheme}>
        <SafeAreaView
          style={{
            flex: 1,
            justifyContent: "space-between",
            backgroundColor: "white",
          }}
        >
          <StatusBar barStyle="light-content" />
          {shouldShowInitialSyncIntro ? this.renderInitialSyncIntro() : null}
          {shouldShowManualSyncIntro ? this.renderManualSyncIntro() : null}
          {shouldShowSyncStatus ? this.renderSyncStatus() : null}
        </SafeAreaView>
      </ThemeProvider>
    );
  }
}

HealthSyncScreen.propTypes = {
  health: PropTypes.object.isRequired,
  navigateGoBack: PropTypes.func.isRequired,
  healthKitInterfaceSet: PropTypes.func.isRequired,
  isInitialSync: PropTypes.bool.isRequired,
};

export default HealthSyncScreen;
