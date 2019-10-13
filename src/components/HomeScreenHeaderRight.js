import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Image, Platform, TouchableOpacity } from "react-native";

import FirstTimeTips from "../models/FirstTimeTips";
import Tooltip from "./Tooltip";
import SimpleTextTooltipContent from "./Tooltips/SimpleTextTooltipContent";
import { ConnectionStatus } from "../models/ConnectionStatus";
import AlertManager from "../models/AlertManager";
import { Metrics } from "../models/Metrics";

class HomeScreenHeaderRight extends PureComponent {
  state = {
    toolTipVisible: false,
  };

  componentDidUpdate() {
    const { navigation, notesFetch, currentUser } = this.props;
    this.showTipIfNeeded({ navigation, notesFetch, currentUser });
  }

  componentWillUnmount() {
    if (this.showTipTimeoutId) {
      clearTimeout(this.showTipTimeoutId);
    }
  }

  onPress = () => {
    const { navigateAddNote } = this.props;
    this.hideTipIfNeeded();
    if (ConnectionStatus.isOffline) {
      AlertManager.showOfflineMessage(
        "It seems you’re offline, so you can't add notes."
      );
    } else {
      Metrics.track({ metric: "Clicked add a note (Home screen)" });
      navigateAddNote();
    }
  };

  showTipIfNeeded(params) {
    if (FirstTimeTips.shouldShowTip(FirstTimeTips.TIP_ADD_NOTE, params)) {
      const { firstTimeTipsShowTip } = this.props;
      this.showTipTimeoutId = setTimeout(() => {
        firstTimeTipsShowTip(FirstTimeTips.TIP_ADD_NOTE, true);
        this.setState({ toolTipVisible: true });
      }, 50);
    }
  }

  hideTipIfNeeded() {
    if (FirstTimeTips.currentTip === FirstTimeTips.TIP_ADD_NOTE) {
      const { firstTimeTipsShowTip } = this.props;
      firstTimeTipsShowTip(FirstTimeTips.TIP_ADD_NOTE, false);
      this.setState({ toolTipVisible: false });
    }
  }

  render() {
    const { toolTipVisible } = this.state;
    return (
      <Tooltip
        isVisible={toolTipVisible}
        placement="bottom"
        content={
          <SimpleTextTooltipContent text="Now, add an event, a meal, or note." />
        }
        arrowStyle={{
          marginLeft: 5,
        }}
        tooltipOriginOffset={{
          x: -8,
          y: Platform.OS === "ios" ? 0 : 3,
        }}
      >
        <TouchableOpacity
          style={{
            padding: 10,
            marginRight: 6,
          }}
          onPress={this.onPress}
        >
          <Image source={require("../../assets/images/add-button.png")} />
        </TouchableOpacity>
      </Tooltip>
    );
  }
}

HomeScreenHeaderRight.propTypes = {
  navigation: PropTypes.object.isRequired,
  notesFetch: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired,
  navigateAddNote: PropTypes.func.isRequired,
  firstTimeTipsShowTip: PropTypes.func.isRequired,
};

export default HomeScreenHeaderRight;
