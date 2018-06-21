import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Image, TouchableOpacity } from "react-native";

import FirstTimeTips from "../models/FirstTimeTips";
import Tooltip from "./Tooltip";
import ConnectHealthTooltipContent from "../components/Tooltips/ConnectHealthTooltipContent";

class HomeScreenHeaderLeft extends PureComponent {
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
    this.props.navigateDrawerOpen();
    this.hideTipIfNeeded();
  };

  showTipIfNeeded(params) {
    if (
      FirstTimeTips.shouldShowTip(FirstTimeTips.TIP_CONNECT_TO_HEALTH, params)
    ) {
      const { firstTimeTipsShowTip } = this.props;
      this.showTipTimeoutId = setTimeout(() => {
        firstTimeTipsShowTip(FirstTimeTips.TIP_CONNECT_TO_HEALTH, true);
        this.setState({ toolTipVisible: true });
      }, 50);
    }
  }

  hideTipIfNeeded() {
    if (FirstTimeTips.currentTip === FirstTimeTips.TIP_CONNECT_TO_HEALTH) {
      const { firstTimeTipsShowTip } = this.props;
      firstTimeTipsShowTip(FirstTimeTips.TIP_CONNECT_TO_HEALTH, false);
      this.setState({ toolTipVisible: false });
    }
  }

  render() {
    return (
      <Tooltip
        isVisible={this.state.toolTipVisible}
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
