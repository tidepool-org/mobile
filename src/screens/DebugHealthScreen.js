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
  }

  onUploaderSimulateValueChange = value => {
    TPNativeHealth.setUploaderSimulate(value);
  }

  onUploaderIncludeSensitiveInfoValueChange = value => {
    TPNativeHealth.setUploaderIncludeSensitiveInfo(value);
  }

  onUploaderIncludeCFNetworkDiagnosticsValueChange = value => {
    Alert.alert("Relaunch Required", "Changing CFNetwork Diagnostics requires a relaunch of the app.", [
      {
        text: "OK",
      },
    ]);
    this.setState({
      restartRequiredForCFNetworkDiagnosticChange: true,
    });
    TPNativeHealth.setUploaderIncludeCFNetworkDiagnostics(value);
  }

  onPressUploadButton = () => {
    TPNativeHealth.startUploadingHistorical();
  };

  onPressCancelButton = () => {
    const {
      health: {
        isUploadingHistorical,
        isHistoricalUploadPending,
      },
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
      health: {
        isUploadingHistorical,
        isHistoricalUploadPending,
      },
    } = this.props;

    if (isUploadingHistorical || isHistoricalUploadPending) {
      Alert.alert("Stop Syncing?", "Stop syncing and reset historical uploader for fresh upload", [
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
      health: { uploaderSuppressDeletes, uploaderSimulate, includeSensitiveInfo, includeCFNetworkDiagnostics },
    } = this.props;

    return (
      <>
        <Grid style={{paddingTop: 8}}>
          <Row>
            <Left styles={styles.left}>
              <Text>Suppress deletes</Text>
            </Left>
            <Right style={styles.right}>
              <Switch
                style={{transform: [{ scaleX: 0.75 }, { scaleY: 0.75 }], marginRight: -6}}
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
                style={{transform: [{ scaleX: 0.75 }, { scaleY: 0.75 }], marginRight: -6}}
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
                style={{transform: [{ scaleX: 0.75 }, { scaleY: 0.75 }], marginRight: -6}}
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
              <Text>{`Include CFNetwork diagnostics${this.state.restartRequiredForCFNetworkDiagnosticChange ? " (restart required)" : ""}`}</Text>
            </Left>
            <Right style={styles.right}>
              <Switch
                style={{transform: [{ scaleX: 0.75 }, { scaleY: 0.75 }], marginRight: -6}}
                trackColor={{ true: Colors.brightBlue, false: null }}
                onValueChange={this.onUploaderIncludeCFNetworkDiagnosticsValueChange}
                value={includeCFNetworkDiagnostics}
              />
            </Right>
          </Row>
        </Grid>
      </>
    )
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
              TPNativeHealth.setUploaderTimeoutsIndex(0)
            }}
        >
          <Left style={styles.left}>
            <Grid>
              <Row>
                <Text>Timeouts: 60, 90, 180, 300</Text>
              </Row>
            </Grid>
          </Left>
          <Right
            style={styles.right}
          >
            <Radio
              selected={uploaderTimeoutsIndex === 0}
              disabled
            />
          </Right>
        </ListItem>
        <ListItem
          onPress={() => {
              TPNativeHealth.setUploaderTimeoutsIndex(1)
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
              TPNativeHealth.setUploaderTimeoutsIndex(2)
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
          <Text>Uploader limits</Text>
        </ListItem>
        <ListItem
          onPress={() => {
        TPNativeHealth.setUploaderLimitsIndex(0)
      }}
        >
          <Left style={styles.left}>
            <Grid>
              <Row>
                <Text>Samples: 2000, 1000, 500, 250</Text>
              </Row>
              <Row>
                <Text>Deletes: 500, 50, 10, 1</Text>
              </Row>
            </Grid>
          </Left>
          <Right
            style={styles.right}
          >
            <Radio
              selected={uploaderLimitsIndex === 0}
              disabled
            />
          </Right>
        </ListItem>
        <ListItem
          onPress={() => {
        TPNativeHealth.setUploaderLimitsIndex(1)
      }}
        >
          <Grid>
            <Row>
              <Left style={styles.left}>
                <Grid>
                  <Row>
                    <Text>Samples: 500, 100, 50, 10</Text>
                  </Row>
                  <Row>
                    <Text>Deletes: 50, 5, 1, 1</Text>
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
        TPNativeHealth.setUploaderLimitsIndex(2)
      }}
        >
          <Grid>
            <Row>
              <Left style={styles.left}>
                <Grid>
                  <Row>
                    <Text>Samples: 100, 50, 25, 5</Text>
                  </Row>
                  <Row>
                    <Text>Deletes: 5, 1, 1, 1</Text>
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
    )
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
        historicalUploadTotalDays,
        historicalUploadTotalSamples,
        historicalUploadTotalDeletes,
      },
    } = this.props;

    if (isUploadingHistorical || (turnOffHistoricalUploaderReason && turnOffHistoricalUploaderReason !== "turned off")) {
      let totalDaysStatsText = "";
      if (historicalUploadTotalDays > 0) {
        totalDaysStatsText = `Uploaded ${historicalUploadCurrentDay} of ${historicalUploadTotalDays} days`;
      }
      const totalCountsStatsText = `Uploaded ${historicalUploadTotalSamples} samples, ${historicalUploadTotalDeletes} deletes`;
      return (
        <Grid>
          {
            totalCountsStatsText ? (
              <Row>
                <Text style={styles.statsText}>
                  {totalCountsStatsText}
                </Text>
              </Row>
            ) : null
          }
          {
            totalDaysStatsText ? (
              <Row>
                <Text style={styles.statsText}>
                  {totalDaysStatsText}
                </Text>
              </Row>
            ) : null
          }
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
        uploaderSuppressDeletes,
        uploaderSimulate,
        includeSensitiveInfo,
      },
    } = this.props;

    let uploadStatusText = "Not uploading"
    if (isUploadingHistoricalRetry) {
      uploadStatusText = `Retrying due to: ${retryHistoricalUploadError}`
    } else if (isUploadingHistorical) {
      uploadStatusText = "Uploading..."
    } else if (isHistoricalUploadPending) {
      uploadStatusText = "Upload pending..."
    } else if (isTurningInterfaceOn) {
      uploadStatusText = "Preparing"
    }

    return (
      <Grid>
        <Row>
          <Left style={styles.left}>
            <Text style={styles.statsText}>{uploadStatusText}</Text>
          </Left>
        </Row>
        {
          !isUploadingHistorical ?
          (
            <Row>
              <Left style={styles.left}>
                <Text style={styles.statsText}>Stopped reason:</Text>
              </Left>
              <Right style={styles.right}>
                <Text style={styles.statsText}>{turnOffHistoricalUploaderReason}</Text>
              </Right>
            </Row>
          ) : null
        }
        {
          turnOffHistoricalUploaderError && turnOffHistoricalUploaderReason !== "turned off" ?
          (
            <>
              <Row>
                <Text style={styles.statsText}>Stopped error:</Text>
              </Row>
              <Row>
                <Text style={styles.statsText}>{turnOffHistoricalUploaderError}</Text>
              </Row>
            </>
          ) : null
        }
        {
          isUploadingHistorical || (turnOffHistoricalUploaderReason && turnOffHistoricalUploaderReason !== "turned off") ?
          (
            <>
              <Row>
                <Text style={styles.statsText}>{`Limits index: ${historicalUploadLimitsIndex}, maxIndex: ${historicalUploadMaxLimitsIndex}`}</Text>
              </Row>
            </>
          ) : null
        }
        {
            uploaderSuppressDeletes ?
            (
              <Row>
                <Text style={styles.statsText}>Suppress deletes</Text>
              </Row>
            ) : null
        }
        {
          uploaderSimulate ?
          (
            <Row>
              <Text style={styles.statsText}>Simulate upload</Text>
            </Row>
          ) : null
        }
        {
          includeSensitiveInfo ?
          (
            <Row>
              <Text style={styles.statsText}>Include sensitive info in logs</Text>
            </Row>
          ) : null
        }
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
                  disabled={isUploadingHistorical || isHistoricalUploadPending || (!isInterfaceOn && !isTurningInterfaceOn)}
                  onPress={this.onPressUploadButton}
                >
                  <Text>Start upload</Text>
                </Button>
                <Button
                  transparent
                  onPress={this.onPressCancelButton}
                  disabled={!isUploadingHistorical && !isHistoricalUploadPending}
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

    let uploadStatusText = "Current uploader not on"
    if (isUploadingCurrentRetry) {
      uploadStatusText = `Retrying due to: ${retryCurrentUploadError}`
    } else if (isUploadingCurrent) {
      uploadStatusText = "Current uploader is on"
    } else if (isTurningInterfaceOn) {
      uploadStatusText = "Preparing"
    }

    return (
      <Grid>
        <Row>
          <Left style={styles.left}>
            <Text style={styles.statsText}>{uploadStatusText}</Text>
          </Left>
        </Row>
        {
          !isUploadingCurrent ?
          (
            <Row>
              <Left style={styles.left}>
                <Text style={styles.statsText}>Stopped reason:</Text>
              </Left>
              <Right style={styles.right}>
                <Text style={styles.statsText}>{turnOffCurrentUploaderReason}</Text>
              </Right>
            </Row>
          ) : null
        }
        {
          turnOffCurrentUploaderError && turnOffCurrentUploaderReason !== "turned off" ?
          (
            <>
              <Row>
                <Text style={styles.statsText}>Stopped error:</Text>
              </Row>
              <Row>
                <Text style={styles.statsText}>{turnOffCurrentUploaderError}</Text>
              </Row>
            </>
          ) : null
        }
        {
          isUploadingCurrent || (turnOffCurrentUploaderError && turnOffCurrentUploaderReason !== "turned off") ?
          (
            <>
              <Row>
                <Text style={styles.statsText}>{`Limits index: ${currentUploadLimitsIndex}, maxIndex: ${currentUploadMaxLimitsIndex}`}</Text>
              </Row>
            </>
          ) : null
        }
        {
            uploaderSuppressDeletes ?
            (
              <Row>
                <Text style={styles.statsText}>Suppress deletes</Text>
              </Row>
            ) : null
        }
        {
          uploaderSimulate ?
          (
            <Row>
              <Text style={styles.statsText}>Simulate upload</Text>
            </Row>
          ) : null
        }
        {
          includeSensitiveInfo ?
          (
            <Row>
              <Text style={styles.statsText}>Include sensitive info in logs</Text>
            </Row>
          ) : null
        }
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
        lastCurrentUploadUiDescription,
      },
    } = this.props;

    if (isUploadingCurrent || (turnOffCurrentUploaderReason && turnOffCurrentUploaderReason !== "turned off")) {
      const totalCountsStatsText = `Uploaded ${currentUploadTotalSamples} samples, ${currentUploadTotalDeletes} deletes`;
      return (
        <Grid>
          {
            totalCountsStatsText ? (
              <Row>
                <Text style={styles.statsText}>
                  {totalCountsStatsText}
                </Text>
              </Row>
            ) : null
          }
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
      health: {
        shouldShowHealthKitUI,
      },
    } = this.props;

    if (shouldShowHealthKitUI) {
      return (
        <Card>
          <CardItem header bordered>
            <Grid>
              <Row>
                <Text style={styles.headerStyle}>Current</Text>
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
    const { navigateGoBack } = this.props;

    return (
      <ThemeProvider theme={this.theme}>
        <Modal visible animationType="slide" onRequestClose={navigateGoBack}>
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
  navigateGoBack: PropTypes.func.isRequired,
};

export default DebugHealthScreen;
