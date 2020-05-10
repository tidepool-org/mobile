import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import {
  Alert,
  Modal,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Switch,
} from "react-native";
import {
  Button,
  Card,
  CardItem,
  Content,
  Grid,
  Left,
  List,
  ListItem,
  Radio,
  Right,
  Row,
  StyleProvider,
  Text,
} from "native-base";
import glamorous, { ThemeProvider } from "glamorous-native";

import { TPNativeHealth } from "../models/TPNativeHealth";
import { UserPropType } from "../prop-types/user";
import PrimaryTheme from "../themes/PrimaryTheme";
import Colors from "../constants/Colors";
import getTheme from "../../native-base-theme/components";
import commonColor from "../../native-base-theme/variables/commonColor";
import { formatDateForNoteList } from "../utils/formatDate";

const styles = StyleSheet.create({
  uploadButton: { marginRight: 0, paddingLeft: 0 },
  headerStyle: { color: Colors.blackish },
  statsText: { color: Colors.blackish },
  left: {
    marginLeft: -10,
    marginRight: 0,
    minWidth: 100,
  },
  right: {},
});

class DebugHealthScreen extends PureComponent {
  state = {
    connectToHealthUserSetting: null,
    restartRequiredForCFNetworkDiagnosticChange: false,
  };

  constructor(props) {
    super(props);

    this.theme = PrimaryTheme;
    this.commonColorTheme = getTheme(commonColor);
  }

  componentDidMount() {
    this.refreshUploadStatsInterval = setInterval(() => {
      TPNativeHealth.refreshUploadStats();
    }, 1000 * 30); // 30 seconds
  }

  // TODO: Revisit this after we upgrade eslint-config-airbnb
  /* eslint-disable react/sort-comp */
  UNSAFE_componentWillReceiveProps(nextProps) {
    const {
      health: { isHealthKitInterfaceEnabledForCurrentUser },
    } = this.props;
    if (
      isHealthKitInterfaceEnabledForCurrentUser !==
      nextProps.health.isHealthKitInterfaceEnabledForCurrentUser
    ) {
      this.setState({
        connectToHealthUserSetting:
          nextProps.health.isHealthKitInterfaceEnabledForCurrentUser,
      });
    }
  }
  /* eslint-enable react/sort-comp */

  componentWillUnmount() {
    clearInterval(this.refreshUploadStatsInterval);
  }

  onPressCancelChangeToOtherUser = () => {
    this.setState({ connectToHealthUserSetting: false });
  };

  onPressChangeToOtherUser = () => {
    TPNativeHealth.enableHealthKitInterfaceAndAuthorize();
  };

  onConnectToHealthValueChange = value => {
    if (value) {
      this.enableHealthKitInterfaceAndAuthorizeForCurrentUser();
    } else {
      TPNativeHealth.disableHealthKitInterface();
    }
    this.setState({ connectToHealthUserSetting: value });
  };

  onUploaderSuppressDeletesValueChange = value => {
    TPNativeHealth.setUploaderSuppressDeletes(value);
  };

  onUploaderSimulateValueChange = value => {
    TPNativeHealth.setUploaderSimulate(value);
  };

  onUploaderIncludeSensitiveInfoValueChange = value => {
    TPNativeHealth.setUploaderIncludeSensitiveInfo(value);
  };

  onUploaderIncludeCFNetworkDiagnosticsValueChange = value => {
    Alert.alert(
      "Relaunch Required",
      "Changing CFNetwork Diagnostics requires a relaunch of the app.",
      [
        {
          text: "OK",
        },
      ]
    );
    this.setState({
      restartRequiredForCFNetworkDiagnosticChange: true,
    });
    TPNativeHealth.setUploaderIncludeCFNetworkDiagnostics(value);
  };

  onUploaderShouldLogHealthDataValueChange = value => {
    if (value) {
      Alert.alert(
        "Log Health data?",
        "Enabling this will log Health data for read, gather, and upload phases of the uploader. This is a lot of data. Are you sure?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "OK",
            onPress: () => {
              TPNativeHealth.setUploaderShouldLogHealthData(value);
            },
          },
        ]
      );
    } else {
      TPNativeHealth.setUploaderShouldLogHealthData(value);
    }
  };

  onUploaderUseLocalNotificationDebug = value => {
    if (value) {
      Alert.alert(
        "Use local debug notifications?",
        "Enabling this will turn on local debug notifications on your device to assist in debugging background uploader behavior.",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "OK",
            onPress: () => {
              TPNativeHealth.setUploaderUseLocalNotificationDebug(value);
            },
          },
        ]
      );
    } else {
      TPNativeHealth.setUploaderUseLocalNotificationDebug(value);
    }
  }

  onPressResetButton = () => {
    Alert.alert(
      "Reset Current?",
      "Reset persistent state of Current uploader so it will start fresh from 4 hours in the past",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            TPNativeHealth.resetCurrentUploader();
          },
        },
      ]
    );
  };

  onPressUploadButton = () => {
    TPNativeHealth.startUploadingHistorical();
  };

  onPressCancelButton = () => {
    const {
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
          },
        },
      ]);
    }
  };

  onPressCancelButton = () => {
    const {
      health: { isUploadingHistorical, isHistoricalUploadPending },
    } = this.props;

    if (isUploadingHistorical || isHistoricalUploadPending) {
      Alert.alert(
        "Stop Syncing?",
        "Stop syncing and reset historical uploader for fresh upload",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "OK",
            onPress: () => {
              TPNativeHealth.stopUploadingHistoricalAndReset();
            },
          },
        ]
      );
    }
  };

  onClose = () => {
    const { navigateDebugSettings, navigateGoBack } = this.props;
    navigateGoBack();
    navigateDebugSettings();
  };

  timeChanged = () => {
    TPNativeHealth.refreshUploadStats();
  };

  enableHealthKitInterfaceAndAuthorizeForCurrentUser() {
    const {
      health: {
        isHealthKitInterfaceConfiguredForOtherUser,
        currentHealthKitUsername,
      },
    } = this.props;

    if (isHealthKitInterfaceConfiguredForOtherUser) {
      const username = currentHealthKitUsername || "Unknown";
      const message = `A different account (${username}) is currently associated with Health Data on this device`;
      Alert.alert("Are you sure?", message, [
        {
          text: "Cancel",
          style: "cancel",
          onPress: this.onPressCancelChangeToOtherUser,
        },
        {
          text: "Change",
          onPress: this.onPressChangeToOtherUser,
        },
      ]);
    } else {
      TPNativeHealth.enableHealthKitInterfaceAndAuthorize();
    }
  }

  renderGlobalConnectToHealthSwitch() {
    const { connectToHealthUserSetting } = this.state;
    const {
      health: { isHealthKitInterfaceEnabledForCurrentUser },
    } = this.props;

    return (
      <Switch
        style={{
          transform: [{ scaleX: 0.75 }, { scaleY: 0.75 }],
          marginRight: -6,
        }}
        trackColor={{ true: Colors.brightBlue, false: null }}
        onValueChange={this.onConnectToHealthValueChange}
        value={
          connectToHealthUserSetting !== null
            ? connectToHealthUserSetting
            : isHealthKitInterfaceEnabledForCurrentUser
        }
      />
    );
  }

  renderGlobalConnectToHealthCardItem() {
    const {
      health: { shouldShowHealthKitUI },
    } = this.props;

    if (shouldShowHealthKitUI) {
      return (
        <CardItem bordered>
          <Grid>
            <Row>
              <Left style={styles.left}>
                <Text>Connect to Health</Text>
              </Left>
              <Right style={styles.right}>
                {this.renderGlobalConnectToHealthSwitch()}
              </Right>
            </Row>
          </Grid>
        </CardItem>
      );
    }

    return null;
  }

  renderGlobalStatsCardItem() {
    const {
      health: {
        shouldShowHealthKitUI,
        isHealthKitInterfaceEnabledForCurrentUser,
        isHealthKitInterfaceConfiguredForOtherUser,
        currentHealthKitUsername,
        hasPresentedSyncUI,
        interfaceTurnedOffError,
        isTurningInterfaceOn,
        isInterfaceOn,
        isHealthKitAuthorized,
      },
    } = this.props;

    let uploaderPreflightStatus = interfaceTurnedOffError;
    if (isInterfaceOn) {
      uploaderPreflightStatus = "prepared";
    } else if (isTurningInterfaceOn) {
      uploaderPreflightStatus = "preparing";
    }

    return (
      <CardItem bordered>
        <Grid>
          <Row>
            <Left style={styles.left}>
              <Text style={styles.statsText}>Should show Health UI:</Text>
            </Left>
            <Right style={styles.right}>
              <Text style={styles.statsText}>
                {shouldShowHealthKitUI.toString()}
              </Text>
            </Right>
          </Row>
          <Row>
            <Left style={styles.left}>
              <Text style={styles.statsText}>Enabled for current user:</Text>
            </Left>
            <Right style={styles.right}>
              <Text style={styles.statsText}>
                {isHealthKitInterfaceEnabledForCurrentUser.toString()}
              </Text>
            </Right>
          </Row>
          <Row>
            <Left style={styles.left}>
              <Text style={styles.statsText}>Configured for other:</Text>
            </Left>
            <Right style={styles.right}>
              <Text style={styles.statsText}>
                {isHealthKitInterfaceConfiguredForOtherUser.toString()}
              </Text>
            </Right>
          </Row>
          <Row>
            <Left style={styles.left}>
              <Text style={styles.statsText}>Current Health user:</Text>
            </Left>
            <Right style={styles.right}>
              <Text style={styles.statsText}>{currentHealthKitUsername}</Text>
            </Right>
          </Row>
          <Row>
            <Left style={styles.left}>
              <Text style={styles.statsText}>Has presented initial sync:</Text>
            </Left>
            <Right style={styles.right}>
              <Text style={styles.statsText}>
                {hasPresentedSyncUI.toString()}
              </Text>
            </Right>
          </Row>
          <Row>
            <Left style={styles.left}>
              <Text style={styles.statsText}>HealthKit authorized:</Text>
            </Left>
            <Right style={styles.right}>
              <Text style={styles.statsText}>
                {isHealthKitAuthorized.toString()}
              </Text>
            </Right>
          </Row>
          <Row>
            <Left style={styles.left}>
              <Text style={styles.statsText}>Uploader preflight status:</Text>
            </Left>
            <Right style={styles.right}>
              <Text style={styles.statsText}>{uploaderPreflightStatus}</Text>
            </Right>
          </Row>
        </Grid>
      </CardItem>
    );
  }

  renderGlobalHealthCard() {
    const { username } = this.props.currentUser;

    return (
      <Card>
        <CardItem header style={{ paddingBottom: 0 }}>
          <Text style={styles.statsText}>Global</Text>
        </CardItem>
        <CardItem bordered>
          <Text style={styles.statsText}>{username || "not signed in"}</Text>
        </CardItem>
        {this.renderGlobalConnectToHealthCardItem()}
        {this.renderGlobalStatsCardItem()}
      </Card>
    );
  }

  renderUploaderOptions() {
    const {
      health: {
        uploaderSuppressDeletes,
        uploaderSimulate,
        includeSensitiveInfo,
        includeCFNetworkDiagnostics,
        shouldLogHealthData,
        useLocalNotificationDebug,
      },
    } = this.props;

    return (
      <>
        <Grid style={{ paddingTop: 8 }}>
          <Row>
            <Left styles={styles.left}>
              <Text>Suppress deletes</Text>
            </Left>
            <Right style={styles.right}>
              <Switch
                style={{
                  transform: [{ scaleX: 0.75 }, { scaleY: 0.75 }],
                  marginRight: -6,
                }}
                trackColor={{ true: Colors.brightBlue, false: null }}
                onValueChange={this.onUploaderSuppressDeletesValueChange}
                value={uploaderSuppressDeletes}
              />
            </Right>
          </Row>
        </Grid>
        <Grid>
          <Row>
            <Left styles={styles.left}>
              <Text>Simulate upload</Text>
            </Left>
            <Right style={styles.right}>
              <Switch
                style={{
                  transform: [{ scaleX: 0.75 }, { scaleY: 0.75 }],
                  marginRight: -6,
                }}
                trackColor={{ true: Colors.brightBlue, false: null }}
                onValueChange={this.onUploaderSimulateValueChange}
                value={uploaderSimulate}
              />
            </Right>
          </Row>
        </Grid>
        <Grid>
          <Row>
            <Left styles={styles.left}>
              <Text>Include sensitive info</Text>
            </Left>
            <Right style={styles.right}>
              <Switch
                style={{
                  transform: [{ scaleX: 0.75 }, { scaleY: 0.75 }],
                  marginRight: -6,
                }}
                trackColor={{ true: Colors.brightBlue, false: null }}
                onValueChange={this.onUploaderIncludeSensitiveInfoValueChange}
                value={includeSensitiveInfo}
              />
            </Right>
          </Row>
        </Grid>
        <Grid>
          <Row>
            <Left styles={styles.left}>
              <Text>
                {`Include CFNetwork diagnostics${
                  this.state.restartRequiredForCFNetworkDiagnosticChange
                    ? " (restart required)"
                    : ""
                }`}
              </Text>
            </Left>
            <Right style={styles.right}>
              <Switch
                style={{
                  transform: [{ scaleX: 0.75 }, { scaleY: 0.75 }],
                  marginRight: -6,
                }}
                trackColor={{ true: Colors.brightBlue, false: null }}
                onValueChange={
                  this.onUploaderIncludeCFNetworkDiagnosticsValueChange
                }
                value={includeCFNetworkDiagnostics}
              />
            </Right>
          </Row>
        </Grid>
        <Grid>
          <Row>
            <Left styles={styles.left}>
              <Text>Log Health data</Text>
            </Left>
            <Right style={styles.right}>
              <Switch
                style={{
                  transform: [{ scaleX: 0.75 }, { scaleY: 0.75 }],
                  marginRight: -6,
                }}
                trackColor={{ true: Colors.brightBlue, false: null }}
                onValueChange={this.onUploaderShouldLogHealthDataValueChange}
                value={shouldLogHealthData}
              />
            </Right>
          </Row>
        </Grid>
        <Grid>
          <Row>
            <Left styles={styles.left}>
              <Text>Use local debug notifications</Text>
            </Left>
            <Right style={styles.right}>
              <Switch
                style={{
                  transform: [{ scaleX: 0.75 }, { scaleY: 0.75 }],
                  marginRight: -6,
                }}
                trackColor={{ true: Colors.brightBlue, false: null }}
                onValueChange={this.onUploaderUseLocalNotificationDebug}
                value={useLocalNotificationDebug}
              />
            </Right>
          </Row>
        </Grid>
      </>
    );
  }

  renderUploaderTimeoutsist() {
    const {
      health: { uploaderTimeoutsIndex },
    } = this.props;

    return (
      <List>
        <ListItem itemHeader first>
          <Text>Uploader timeouts</Text>
        </ListItem>
        <ListItem
          onPress={() => {
            TPNativeHealth.setUploaderTimeoutsIndex(0);
          }}
        >
          <Left style={styles.left}>
            <Grid>
              <Row>
                <Text>Timeouts: 60, 90, 180, 300</Text>
              </Row>
            </Grid>
          </Left>
          <Right style={styles.right}>
            <Radio selected={uploaderTimeoutsIndex === 0} disabled />
          </Right>
        </ListItem>
        <ListItem
          onPress={() => {
            TPNativeHealth.setUploaderTimeoutsIndex(1);
          }}
        >
          <Left style={styles.left}>
            <Grid>
              <Row>
                <Text>Timeouts: 90, 180, 300, 300</Text>
              </Row>
            </Grid>
          </Left>
          <Right style={styles.right}>
            <Radio selected={uploaderTimeoutsIndex === 1} disabled />
          </Right>
        </ListItem>
        <ListItem
          onPress={() => {
            TPNativeHealth.setUploaderTimeoutsIndex(2);
          }}
        >
          <Left style={styles.left}>
            <Grid>
              <Row>
                <Text>Timeouts: 180, 300, 300, 300</Text>
              </Row>
            </Grid>
          </Left>
          <Right style={styles.right}>
            <Radio selected={uploaderTimeoutsIndex === 2} disabled />
          </Right>
        </ListItem>
      </List>
    );
  }

  renderUploaderLimitsList() {
    const {
      health: { uploaderLimitsIndex },
    } = this.props;

    return (
      <List>
        <ListItem itemHeader first>
          <Text>Uploader limits (delete limits are used for both samples and deletes when in background)</Text>
        </ListItem>
        <ListItem
          onPress={() => {
            TPNativeHealth.setUploaderLimitsIndex(0);
          }}
        >
          <Left style={styles.left}>
            <Grid>
              <Row>
                <Text>Samples: 2400, 1200, 600, 240</Text>
              </Row>
              <Row>
                <Text>Deletes: 120, 60, 24, 12</Text>
              </Row>
            </Grid>
          </Left>
          <Right style={styles.right}>
            <Radio selected={uploaderLimitsIndex === 0} disabled />
          </Right>
        </ListItem>
        <ListItem
          onPress={() => {
            TPNativeHealth.setUploaderLimitsIndex(1);
          }}
        >
          <Grid>
            <Row>
              <Left style={styles.left}>
                <Grid>
                  <Row>
                    <Text>Samples: 600, 240, 120, 60</Text>
                  </Row>
                  <Row>
                    <Text>Deletes: 60, 24, 12, 12</Text>
                  </Row>
                </Grid>
              </Left>
              <Right style={styles.right}>
                <Radio selected={uploaderLimitsIndex === 1} disabled />
              </Right>
            </Row>
          </Grid>
        </ListItem>
        <ListItem
          onPress={() => {
            TPNativeHealth.setUploaderLimitsIndex(2);
          }}
        >
          <Grid>
            <Row>
              <Left style={styles.left}>
                <Grid>
                  <Row>
                    <Text>Samples: 240, 120, 60, 24</Text>
                  </Row>
                  <Row>
                    <Text>Deletes: 24, 12, 12, 12</Text>
                  </Row>
                </Grid>
              </Left>
              <Right style={styles.right}>
                <Radio selected={uploaderLimitsIndex === 2} disabled />
              </Right>
            </Row>
          </Grid>
        </ListItem>
      </List>
    );
  }

  renderUploaderSettingsCardItem() {
    return (
      <CardItem bordered>
        <Content>
          {this.renderUploaderOptions()}
          {this.renderUploaderLimitsList()}
          {this.renderUploaderTimeoutsist()}
        </Content>
      </CardItem>
    );
  }

  renderUploaderSettingsCard() {
    return (
      <Card>
        <CardItem header style={{ paddingBottom: 0 }}>
          <Text style={styles.statsText}>Uploader Settings</Text>
        </CardItem>
        {this.renderUploaderSettingsCardItem()}
      </Card>
    );
  }

  renderHistoricalUploadStats() {
    const {
      health: {
        turnOffHistoricalUploaderReason,
        isUploadingHistorical,
        historicalUploadCurrentDay,
        historicalTotalDaysCount,
        historicalUploadTotalSamples,
        historicalUploadTotalDeletes,
        historicalUploadEarliestSampleTime,
        historicalUploadLatestSampleTime,
        historicalEndAnchorTime,
      },
    } = this.props;

    if (
      isUploadingHistorical ||
      (turnOffHistoricalUploaderReason &&
        turnOffHistoricalUploaderReason !== "turned off")
    ) {
      const useDaysProgress = false;
      const samplesUploadedCountText = `Uploaded ${historicalUploadTotalSamples.toLocaleString()} samples`;
      const deletesFoundCountText = `Found ${historicalUploadTotalDeletes.toLocaleString()} deletes`;
      let totalDaysStatsText = "";
      if (useDaysProgress && historicalTotalDaysCount > 0) {
        totalDaysStatsText = `Uploaded ${historicalUploadCurrentDay.toLocaleString()} of ${historicalTotalDaysCount.toLocaleString()} days`;
      }
      return (
        <Grid>
          <Row>
            <Text style={styles.statsText}>{samplesUploadedCountText}</Text>
          </Row>
          <Row>
            <Text style={styles.statsText}>{deletesFoundCountText}</Text>
          </Row>
          {useDaysProgress ? (
            <Row>
              <Text style={styles.statsText}>{totalDaysStatsText}</Text>
            </Row>
          ) : null}
          {historicalEndAnchorTime ? (
            <Row>
              <Text style={styles.statsText}>
                {`end anchor: ${formatDateForNoteList(
                  historicalEndAnchorTime
                )}`}
              </Text>
            </Row>
          ) : null}
          {historicalUploadEarliestSampleTime &&
          historicalUploadLatestSampleTime ? (
            <>
              <Row>
                <Text style={styles.statsText}>
                  {`earliest sample: ${formatDateForNoteList(
                    historicalUploadEarliestSampleTime
                  )}`}
                </Text>
              </Row>
              <Row>
                <Text style={styles.statsText}>
                  {`latest sample: ${formatDateForNoteList(
                    historicalUploadLatestSampleTime
                  )}`}
                </Text>
              </Row>
            </>
          ) : null}
        </Grid>
      );
    }

    return null;
  }

  renderHistoricalUploadStatus() {
    const {
      health: {
        isTurningInterfaceOn,
        isUploadingHistorical,
        isUploadingHistoricalRetry,
        isHistoricalUploadPending,
        turnOffHistoricalUploaderReason,
        turnOffHistoricalUploaderError,
        retryHistoricalUploadError,
        historicalUploadLimitsIndex,
        historicalUploadMaxLimitsIndex,
        uploaderSimulate,
        includeSensitiveInfo,
        historicalTotalDaysCount,
        historicalTotalSamplesCount,
      },
    } = this.props;

    let uploadStatusText = "Not uploading";
    if (isUploadingHistoricalRetry) {
      uploadStatusText = `Retrying due to: ${retryHistoricalUploadError}`;
    } else if (isTurningInterfaceOn) {
      uploadStatusText = "Preparing to upload";
    } else if (isHistoricalUploadPending) {
      uploadStatusText = "Counting samples to upload";
    } else if (isUploadingHistorical) {
      uploadStatusText = "Uploading";
    }

    return (
      <Grid>
        <Row>
          <Left style={styles.left}>
            <Text style={styles.statsText}>{uploadStatusText}</Text>
          </Left>
        </Row>
        {isUploadingHistorical || isHistoricalUploadPending || (turnOffHistoricalUploaderReason && turnOffHistoricalUploaderReason !== "turned off") ? (
          <>
            <Row>
              <Left style={styles.left}>
                <Text style={styles.statsText}>Total samples to upload:</Text>
              </Left>
              <Right style={styles.right}>
                <Text style={styles.statsText}>
                  {historicalTotalSamplesCount.toLocaleString()}
                </Text>
              </Right>
            </Row>
            <Row>
              <Left style={styles.left}>
                <Text style={styles.statsText}>Total days to upload:</Text>
              </Left>
              <Right style={styles.right}>
                <Text style={styles.statsText}>
                  {historicalTotalDaysCount.toLocaleString()}
                </Text>
              </Right>
            </Row>
          </>
      ) : null}
        {!isUploadingHistorical && !isHistoricalUploadPending && turnOffHistoricalUploaderReason ? (
          <Row>
            <Left style={styles.left}>
              <Text style={styles.statsText}>Stopped reason:</Text>
            </Left>
            <Right style={styles.right}>
              <Text style={styles.statsText}>
                {turnOffHistoricalUploaderReason}
              </Text>
            </Right>
          </Row>
        ) : null}
        {turnOffHistoricalUploaderError &&
        turnOffHistoricalUploaderReason !== "turned off" ? (
          <>
            <Row>
              <Text style={styles.statsText}>Stopped error:</Text>
            </Row>
            <Row>
              <Text style={styles.statsText}>
                {turnOffHistoricalUploaderError}
              </Text>
            </Row>
          </>
        ) : null}
        {isUploadingHistorical ||
        (turnOffHistoricalUploaderReason &&
          turnOffHistoricalUploaderReason !== "turned off") ? (
            <>
              <Row>
                <Text style={styles.statsText}>
                  {`Limits index: ${historicalUploadLimitsIndex}, maxIndex: ${historicalUploadMaxLimitsIndex}`}
                </Text>
              </Row>
            </>
        ) : null}
        {isUploadingHistorical ? (
          <Row>
            <Text style={styles.statsText}>
              Historical always suppresses deletes
            </Text>
          </Row>
        ) : null}
        {isUploadingHistorical && uploaderSimulate ? (
          <Row>
            <Text style={styles.statsText}>Simulate upload</Text>
          </Row>
        ) : null}
        {isUploadingHistorical && includeSensitiveInfo ? (
          <Row>
            <Text style={styles.statsText}>Include sensitive info in logs</Text>
          </Row>
        ) : null}
      </Grid>
    );
  }

  renderHistoricalHealthCard() {
    const {
      health: {
        shouldShowHealthKitUI,
        isUploadingHistorical,
        isHistoricalUploadPending,
        isInterfaceOn,
        isTurningInterfaceOn,
      },
    } = this.props;

    if (shouldShowHealthKitUI) {
      return (
        <Card>
          <CardItem header bordered style={{ paddingBottom: 0 }}>
            <Grid>
              <Row>
                <Text style={styles.headerStyle}>Historical</Text>
              </Row>
              <Row>
                <Button
                  transparent
                  disabled={
                    isUploadingHistorical ||
                    isHistoricalUploadPending ||
                    (!isInterfaceOn && !isTurningInterfaceOn)
                  }
                  onPress={this.onPressUploadButton}
                >
                  <Text>Start upload</Text>
                </Button>
                <Button
                  transparent
                  onPress={this.onPressCancelButton}
                  disabled={
                    !isUploadingHistorical && !isHistoricalUploadPending
                  }
                >
                  <Text>Cancel</Text>
                </Button>
              </Row>
            </Grid>
          </CardItem>
          <CardItem bordered>
            <Grid>
              <Row>{this.renderHistoricalUploadStatus()}</Row>
              <Row>{this.renderHistoricalUploadStats()}</Row>
            </Grid>
          </CardItem>
        </Card>
      );
    }

    return null;
  }

  renderCurrentUploadStatus() {
    const {
      health: {
        isTurningInterfaceOn,
        isUploadingCurrent,
        isUploadingCurrentRetry,
        retryCurrentUploadError,
        currentUploadLimitsIndex,
        currentUploadMaxLimitsIndex,
        turnOffCurrentUploaderReason,
        turnOffCurrentUploaderError,
        uploaderSuppressDeletes,
        uploaderSimulate,
        includeSensitiveInfo,
      },
    } = this.props;

    let uploadStatusText = "Current uploader not on";
    if (isUploadingCurrentRetry) {
      uploadStatusText = `Retrying due to: ${retryCurrentUploadError}`;
    } else if (isUploadingCurrent) {
      uploadStatusText = "Current uploader is on";
    } else if (isTurningInterfaceOn) {
      uploadStatusText = "Preparing to upload";
    }

    return (
      <Grid>
        <Row>
          <Left style={styles.left}>
            <Text style={styles.statsText}>{uploadStatusText}</Text>
          </Left>
        </Row>
        {!isUploadingCurrent && turnOffCurrentUploaderReason ? (
          <Row>
            <Left style={styles.left}>
              <Text style={styles.statsText}>Stopped reason:</Text>
            </Left>
            <Right style={styles.right}>
              <Text style={styles.statsText}>
                {turnOffCurrentUploaderReason}
              </Text>
            </Right>
          </Row>
        ) : null}
        {turnOffCurrentUploaderError &&
        turnOffCurrentUploaderReason !== "turned off" ? (
          <>
            <Row>
              <Text style={styles.statsText}>Stopped error:</Text>
            </Row>
            <Row>
              <Text style={styles.statsText}>
                {turnOffCurrentUploaderError}
              </Text>
            </Row>
          </>
        ) : null}
        {isUploadingCurrent ||
        (turnOffCurrentUploaderError &&
          turnOffCurrentUploaderReason !== "turned off") ? (
            <>
              <Row>
                <Text style={styles.statsText}>
                  {`Limits index: ${currentUploadLimitsIndex}, maxIndex: ${currentUploadMaxLimitsIndex}`}
                </Text>
              </Row>
            </>
        ) : null}
        {isUploadingCurrent && uploaderSuppressDeletes ? (
          <Row>
            <Text style={styles.statsText}>Suppress deletes</Text>
          </Row>
        ) : null}
        {isUploadingCurrent && uploaderSimulate ? (
          <Row>
            <Text style={styles.statsText}>Simulate upload</Text>
          </Row>
        ) : null}
        {isUploadingCurrent && includeSensitiveInfo ? (
          <Row>
            <Text style={styles.statsText}>Include sensitive info in logs</Text>
          </Row>
        ) : null}
      </Grid>
    );
  }

  renderCurrentUploadStats() {
    const {
      health: {
        turnOffCurrentUploaderReason,
        isUploadingCurrent,
        currentUploadTotalSamples,
        currentUploadTotalDeletes,
        currentUploadEarliestSampleTime,
        currentUploadLatestSampleTime,
        currentStartAnchorTime,
        lastCurrentUploadUiDescription,
      },
    } = this.props;

    if (
      isUploadingCurrent ||
      (turnOffCurrentUploaderReason &&
        turnOffCurrentUploaderReason !== "turned off")
    ) {
      const totalCountsStatsText = `Uploaded ${currentUploadTotalSamples.toLocaleString()} samples, ${currentUploadTotalDeletes.toLocaleString()} deletes`;
      return (
        <Grid>
          {totalCountsStatsText ? (
            <Row>
              <Text style={styles.statsText}>{totalCountsStatsText}</Text>
            </Row>
          ) : null}
          {currentStartAnchorTime ? (
            <Row>
              <Text style={styles.statsText}>
                {`start anchor: ${formatDateForNoteList(
                  currentStartAnchorTime
                )}`}
              </Text>
            </Row>
          ) : null}
          {currentUploadEarliestSampleTime && currentUploadLatestSampleTime ? (
            <>
              <Row>
                <Text style={styles.statsText}>
                  {`earliest sample: ${formatDateForNoteList(
                    currentUploadEarliestSampleTime
                  )}`}
                </Text>
              </Row>
              <Row>
                <Text style={styles.statsText}>
                  {`latest sample: ${formatDateForNoteList(
                    currentUploadLatestSampleTime
                  )}`}
                </Text>
              </Row>
            </>
          ) : null}
          <Row>
            <Text style={styles.statsText}>
              {lastCurrentUploadUiDescription}
            </Text>
          </Row>
        </Grid>
      );
    }

    return null;
  }

  renderCurrentHealthCard() {
    const {
      health: { shouldShowHealthKitUI },
    } = this.props;

    if (shouldShowHealthKitUI) {
      return (
        <Card>
          <CardItem header bordered>
            <Grid>
              <Row>
                <Text style={styles.headerStyle}>Current</Text>
              </Row>
              <Row>
                <Button transparent onPress={this.onPressResetButton}>
                  <Text>Reset</Text>
                </Button>
              </Row>
            </Grid>
          </CardItem>
          <CardItem bordered>
            <Grid>
              <Row>{this.renderCurrentUploadStatus()}</Row>
              <Row>{this.renderCurrentUploadStats()}</Row>
            </Grid>
          </CardItem>
        </Card>
      );
    }

    return null;
  }

  render() {
    return (
      <ThemeProvider theme={this.theme}>
        <Modal visible animationType="slide" onRequestClose={this.onClose}>
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
              <glamorous.TouchableOpacity onPress={this.onClose}>
                <glamorous.Image
                  source={require("../../assets/images/modal-close-button.png")}
                  width={32}
                  height={32}
                />
              </glamorous.TouchableOpacity>
              <glamorous.Text style={this.theme.debugSettingsHeaderTitleStyle}>
                Debug Health
              </glamorous.Text>
              <glamorous.View width={32} height={32} />
            </glamorous.View>
            <glamorous.ScrollView>
              <StyleProvider style={this.commonColorTheme}>
                <Content padder>
                  {this.renderGlobalHealthCard()}
                  {this.renderCurrentHealthCard()}
                  {this.renderHistoricalHealthCard()}
                  {this.renderUploaderSettingsCard()}
                </Content>
              </StyleProvider>
            </glamorous.ScrollView>
          </SafeAreaView>
        </Modal>
      </ThemeProvider>
    );
  }
}

DebugHealthScreen.propTypes = {
  currentUser: UserPropType.isRequired,
  health: PropTypes.object.isRequired,
  navigateDebugSettings: PropTypes.func.isRequired,
  navigateGoBack: PropTypes.func.isRequired,
};

export default DebugHealthScreen;
