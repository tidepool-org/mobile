import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Image, TouchableOpacity } from "react-native";

import FirstTimeTips from "../models/FirstTimeTips";
import Tooltip from "./Tooltip";
import ConnectHealthTooltipContent from "./Tooltips/ConnectHealthTooltipContent";
import { Metrics } from "../models/Metrics";

class HomeScreenHeaderLeft extends PureComponent {
  state = {
    toolTipVisible: false,
  };

  componentDidUpdate() {
    const { navigation, notesFetch, currentUser } = this.props;
    this.showTipIfNeeded({ navigation, notesFetch, currentUser });
    this.hideTipIfNeeded({ navigation });
  }

  componentWillUnmount() {
    if (this.showTipTimeoutId) {
      clearTimeout(this.showTipTimeoutId);
    }
  }

  onPress = () => {
    const { navigateDrawerOpen } = this.props;
    navigateDrawerOpen();
    Metrics.track({ metric: "Clicked Hamburger (Home Screen)" });
    // TODO: metrics - we also need "Viewed Hamburger Menu (Hamburger)" (for when menu is opened, even via gesture)
    this.hideTipIfNeeded({ didUserDismiss: true });
  };

  showTipIfNeeded(params) {
    if (
      FirstTimeTips.shouldShowTip(FirstTimeTips.TIP_CONNECT_TO_HEALTH, params)
    ) {
      const { firstTimeTipsShowTip } = this.props;
      this.showTipTimeoutId = setTimeout(() => {
        firstTimeTipsShowTip({
          tip: FirstTimeTips.TIP_CONNECT_TO_HEALTH,
          show: true,
        });
        this.setState({ toolTipVisible: true });
      }, 50);
    }
  }

  hideTipIfNeeded({ navigation, didUserDismiss }) {
    if (
      FirstTimeTips.shouldHideTip(FirstTimeTips.TIP_CONNECT_TO_HEALTH, {
        navigation,
        didUserDismiss,
      })
    ) {
      const { firstTimeTipsShowTip } = this.props;
      firstTimeTipsShowTip({
        tip: FirstTimeTips.TIP_CONNECT_TO_HEALTH,
        show: false,
        didUserDismiss,
      });
      this.setState({ toolTipVisible: false });
    }
  }

  render() {
    const { toolTipVisible } = this.state;
    return (
      <Tooltip
        isVisible={toolTipVisible}
        placement="bottom"
        content={<ConnectHealthTooltipContent />}
        arrowStyle={{
          marginLeft: -5,
        }}
        tooltipOriginOffset={{
          x: 8,
          y: 4,
        }}
      >
        <TouchableOpacity
          style={{
            padding: 10,
            marginLeft: 6,
          }}
          onPress={this.onPress}
        >
          <Image
            tintColor="white"
            source={require("../../assets/images/menu-button.png")}
          />
        </TouchableOpacity>
      </Tooltip>
    );
  }
}

HomeScreenHeaderLeft.propTypes = {
  navigation: PropTypes.object.isRequired,
  notesFetch: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired,
  navigateDrawerOpen: PropTypes.func.isRequired,
  firstTimeTipsShowTip: PropTypes.func.isRequired,
};

export default HomeScreenHeaderLeft;
