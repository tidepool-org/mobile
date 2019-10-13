import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import {
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
  statsText: { color: Colors.altDarkGreyColor },
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
  };

  constructor(props) {
    super(props);

    this.theme = PrimaryTheme;
    this.commonColorTheme = getTheme(commonColor);
  }

  componentWillReceiveProps(nextProps) {
    const {
      health: { healthKitInterfaceEnabledForCurrentUser },
    } = this.props;
    if (
      healthKitInterfaceEnabledForCurrentUser !==
      nextProps.health.healthKitInterfaceEnabledForCurrentUser
    ) {
      this.setState({
        connectToHealthUserSetting:
          nextProps.health.healthKitInterfaceEnabledForCurrentUser,
      });
    }
  }

  onConnectToHealthValueChange = value => {
    if (value) {
      TPNativeHealth.enableHealthKitInterface();
    } else {
      TPNativeHealth.disableHealthKitInterface();
    }
    this.setState({ connectToHealthUserSetting: value });
  };

  onPressUploadButton = () => {
    TPNativeHealth.startUploadingHistorical();
  };

  onPressResetButton = () => {
    TPNativeHealth.stopUploadingHistorical();
  };

  renderGlobalConnectToHealthSwitch() {
    const { connectToHealthUserSetting } = this.state;
    const {
      health: { healthKitInterfaceEnabledForCurrentUser },
    } = this.props;

    return (
      <Switch
        style={{
          transform: [{ scaleX: 0.75 }, { scaleY: 0.75 }],
          marginRight: -10,
        }}
        trackColor={{ true: Colors.brightBlue, false: null }}
        onValueChange={this.onConnectToHealthValueChange}
        value={
          connectToHealthUserSetting !== null
            ? connectToHealthUserSetting
            : healthKitInterfaceEnabledForCurrentUser
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
        healthKitInterfaceEnabledForCurrentUser,
        healthKitInterfaceConfiguredForOtherUser,
      },
    } = this.props;

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
                {healthKitInterfaceEnabledForCurrentUser.toString()}
              </Text>
            </Right>
          </Row>
          <Row>
            <Left style={styles.left}>
              <Text style={styles.statsText}>Configured for other:</Text>
            </Left>
            <Right style={styles.right}>
              <Text style={styles.statsText}>
                {healthKitInterfaceConfiguredForOtherUser.toString()}
              </Text>
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

  renderHistoricalUploadStats() {
    const {
      health: {
        turnOffUploaderReason,
        isUploadingHistorical,
        historicalUploadCurrentDay,
        historicalTotalDays,
        historicalTotalUploadCount,
      },
    } = this.props;

    // TODO: health -  Revisit this temporary work around for an issue where
    // upload stats show 1 of 1 days before determining true total number of
    // days!
    if (historicalTotalDays <= 1 && historicalTotalUploadCount <= 1) {
      return null;
    }

    if (isUploadingHistorical || turnOffUploaderReason) {
      return (
        <Grid>
          <Row>
            <Text>
              {`Uploaded ${historicalUploadCurrentDay} of ${historicalTotalDays} days`}
            </Text>
          </Row>
          <Row>
            <Text>
              {`Total samples uploaded: ${historicalTotalUploadCount}`}
            </Text>
          </Row>
        </Grid>
      );
    }

    return null;
  }

  renderHistoricalUploadStoppedReason() {
    const {
      health: {
        isUploadingHistorical,
        turnOffUploaderReason,
        turnOffUploaderError,
      },
    } = this.props;

    if (!isUploadingHistorical && turnOffUploaderReason) {
      return (
        <Grid>
          <Row>
            <Left style={styles.left}>
              <Text>Stopped reason:</Text>
            </Left>
            <Right style={styles.right}>
              <Text>{turnOffUploaderReason}</Text>
            </Right>
          </Row>
          {turnOffUploaderError ? (
            <Grid>
              <Row>
                <Text>Stopped error:</Text>
              </Row>
              <Row>
                <Text>{turnOffUploaderError}</Text>
              </Row>
            </Grid>
          ) : null}
        </Grid>
      );
    }

    return null;
  }

  renderHistoricalHealthCard() {
    const {
      health: { isUploadingHistorical },
    } = this.props;

    const {
      health: {
        shouldShowHealthKitUI,
        healthKitInterfaceEnabledForCurrentUser,
        healthKitInterfaceConfiguredForOtherUser,
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
                    (!healthKitInterfaceEnabledForCurrentUser &&
                      !healthKitInterfaceConfiguredForOtherUser)
                  }
                  onPress={this.onPressUploadButton}
                >
                  <Text>Start upload</Text>
                </Button>
                <Button
                  transparent
                  disabled={
                    !healthKitInterfaceEnabledForCurrentUser &&
                    !healthKitInterfaceConfiguredForOtherUser
                  }
                  onPress={this.onPressResetButton}
                >
                  <Text>Reset</Text>
                </Button>
              </Row>
            </Grid>
          </CardItem>
          <CardItem bordered>
            <Grid>
              <Row>{this.renderHistoricalUploadStoppedReason()}</Row>
              <Row>{this.renderHistoricalUploadStats()}</Row>
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
                  {this.renderHistoricalHealthCard()}
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
