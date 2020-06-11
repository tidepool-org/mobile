import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import {
  ActivityIndicator,
  Alert,
  ProgressViewIOS,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { ThemeProvider } from "glamorous-native";
import Hyperlink from "react-native-hyperlink";

import PrimaryTheme from "../themes/PrimaryTheme";
import { TPNativeHealth } from "../models/TPNativeHealth";
import Button from "../components/Button";

import Colors from "../constants/Colors";

const ACTIVITY_INDICATOR_VIEW_HEIGHT = 62;
const INSTRUCTIONS_LINK =
  "https://support.tidepool.org/hc/en-us/articles/360034537092-Verify-Tidepool-Mobile-Apple-Health-Permissions";

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
    paddingBottom: 20,
    alignSelf: "center",
    textAlign: "center",
    ...PrimaryTheme.healthSyncTextSecondary,
  },
  line1Text: {
    marginTop: 10,
    alignSelf: "center",
    ...PrimaryTheme.healthSyncTextSecondary,
  },
  syncProgressView: {
    padding: 10,
    width: 300,
    alignSelf: "center",
  },
  syncProgressExplanation: {
    width: 300,
    alignSelf: "center",
    textAlign: "center",
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
      healthStateSet,
      health: { isUploadingHistorical, isHistoricalUploadPending },
    } = this.props;

    TPNativeHealth.setHasPresentedSyncUI();
    healthStateSet({
      hasPresentedSyncUI: true,
    });

    if (isUploadingHistorical || isHistoricalUploadPending) {
      this.setState({
        shouldShowSyncStatus: true,
      });
    }
  }

  /* eslint-disable react/no-did-update-set-state */
  componentDidUpdate() {
    const {
      health: { isUploadingHistorical, isHistoricalUploadPending },
    } = this.props;

    if (isUploadingHistorical || isHistoricalUploadPending) {
      this.setState({
        shouldShowSyncStatus: true,
      });
    }
  }
  /* eslint-enable react/no-did-update-set-state */

  onPressCancelOrContinue = () => {
    const {
      navigateGoBack,
      health: { isUploadingHistorical, isHistoricalUploadPending },
    } = this.props;

    if (isUploadingHistorical || isHistoricalUploadPending) {
      Alert.alert("Stop Syncing?", null, [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            TPNativeHealth.stopUploadingHistoricalAndReset();
            navigateGoBack();
          },
        },
      ]);
    } else {
      navigateGoBack();
    }
  };

  onPressSync = () => {
    TPNativeHealth.startUploadingHistorical();

    this.setState({
      shouldShowSyncStatus: true,
    });
  };

  renderSyncProgressBarOrSpinner() {
    const {
      health: {
        isInterfaceOn,
        isHistoricalUploadPending,
        historicalUploadTotalSamples,
        historicalTotalSamplesCount,
        isUploadingHistorical,
        turnOffHistoricalUploaderReason,
      },
    } = this.props;

    if (isHistoricalUploadPending) {
      return (
        <ActivityIndicator
          style={{
            height: ACTIVITY_INDICATOR_VIEW_HEIGHT,
            alignSelf: "center",
          }}
          size="large"
          color={PrimaryTheme.colors.activityIndicator}
          animating
        />
      );
    } else if (
      isInterfaceOn &&
      (isUploadingHistorical || turnOffHistoricalUploaderReason) &&
      historicalTotalSamplesCount > 0
    ) {
      let progress = 0;
      if (
        (isUploadingHistorical || turnOffHistoricalUploaderReason) &&
        historicalTotalSamplesCount > 0
      ) {
        progress = historicalUploadTotalSamples / historicalTotalSamplesCount;
      }

      return (
        <ProgressViewIOS
          progressTintColor={PrimaryTheme.progressTintColor}
          trackTintColor={PrimaryTheme.trackTintColor}
          progress={progress}
          visible={false}
        />
      );
    }
    return null;
  }

  renderSyncProgress() {
    const {
      health: {
        isUploadingHistorical,
        isHistoricalUploadPending,
        historicalTotalSamplesCount,
        historicalUploadTotalSamples,
        historicalUploadCurrentDay,
        historicalTotalDaysCount,
        isUploadingHistoricalRetry,
        turnOffHistoricalUploaderReason,
        turnOffHistoricalUploaderError,
        interfaceTurnedOffError,
        isInterfaceOn,
      },
      isOffline,
    } = this.props;

    let line1Text = "";
    let line2Text = "";
    if (isInterfaceOn) {
      const useDaysProgress = false;
      if (
        isOffline ||
        isUploadingHistorical ||
        turnOffHistoricalUploaderReason
      ) {
        if (isOffline && !isHistoricalUploadPending) {
          line1Text = "Upload paused while offline.";
        }
        let progressText = "";
        if (useDaysProgress) {
          if (historicalUploadCurrentDay > 0) {
            progressText = `Day ${historicalUploadCurrentDay.toLocaleString()} of ${historicalTotalDaysCount.toLocaleString()}`;
          }
        } else if (historicalUploadTotalSamples > 0) {
          progressText = `Uploaded ${new Intl.NumberFormat(undefined, {
            style: "percent",
          }).format(
            historicalUploadTotalSamples / historicalTotalSamplesCount
          )}`;
        }
        if (progressText) {
          if (line1Text) {
            line2Text = line1Text;
          }
          line1Text = progressText;
        }
        if (isUploadingHistoricalRetry) {
          if (line1Text) {
            line2Text = "Retrying";
          } else {
            line1Text = "Retrying";
          }
        }
        if (!isOffline && turnOffHistoricalUploaderReason) {
          if (
            turnOffHistoricalUploaderReason === "complete" &&
            historicalUploadTotalSamples === 0
          ) {
            line1Text = "No data available to upload.";
          } else if (line1Text) {
            line2Text = turnOffHistoricalUploaderError;
          } else {
            line1Text = turnOffHistoricalUploaderError;
          }
        }
      }
    } else {
      line1Text = interfaceTurnedOffError;
    }

    // Ensure that the text contents has at least the numberOfLines specified in
    // the text so that enough space is reserved in layout regardless of text
    // contents so that layout doesn't jump around
    line1Text = `${line1Text}\n `;
    line2Text = `${line2Text}\n \n \n \n `;

    return (
      <View style={styles.syncProgressView}>
        {this.renderSyncProgressBarOrSpinner()}
        <View>
          <Text style={styles.line1Text} numberOfLines={1}>
            {line1Text}
          </Text>
        </View>
        <View>
          <Text style={styles.line1Text} numberOfLines={4}>
            {line2Text}
          </Text>
        </View>
      </View>
    );
  }

  renderSyncStatus() {
    const {
      health: {
        isUploadingHistorical,
        isHistoricalUploadPending,
        isTurningInterfaceOn,
        turnOffHistoricalUploaderReason,
      },
      isOffline,
    } = this.props;

    let primaryText = "";
    let syncProgressExplanation =
      "Stay on this screen during sync or sync will be paused.";
    let buttonTitle = "Continue";

    if (isTurningInterfaceOn || isHistoricalUploadPending) {
      primaryText = "Preparing to upload";
      buttonTitle = "Cancel";
    } else if (isOffline) {
      primaryText = "Paused";
      buttonTitle = "Cancel";
      syncProgressExplanation = "";
    } else if (isUploadingHistorical) {
      primaryText = "Syncing Now";
      buttonTitle = "Cancel";
    } else if (turnOffHistoricalUploaderReason === "complete") {
      primaryText = "Sync Complete";
    } else if (turnOffHistoricalUploaderReason === "error") {
      primaryText = "Sync Error";
      syncProgressExplanation = "";
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
          <Hyperlink
            linkDefault
            linkStyle={PrimaryTheme.hyperlink}
            linkText={(url) => (url === INSTRUCTIONS_LINK ? "here" : url)}
          >
            <Text>
              <Text style={styles.introManualSyncSecondaryText}>
                Be sure you have authorized Tidepool to read your data from
                Apple Health. You can find more detailed instructions
              </Text>
              <Text> </Text>
              <Text style={styles.introManualSyncSecondaryText}>
                {INSTRUCTIONS_LINK}
              </Text>
              <Text>.</Text>
            </Text>
          </Hyperlink>
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
  isOffline: PropTypes.bool,
  navigateGoBack: PropTypes.func.isRequired,
  healthStateSet: PropTypes.func.isRequired,
  isInitialSync: PropTypes.bool.isRequired,
};

HealthSyncScreen.defaultProps = {
  isOffline: false,
};

export default HealthSyncScreen;
