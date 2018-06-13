import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Image, Platform, TouchableOpacity } from "react-native";

import Tooltip from "./Tooltip";
import ConnectHealthTooltipContent from "../components/Tooltips/ConnectHealthTooltipContent";

class HomeScreenHeaderLeft extends PureComponent {
  state = {
    toolTipVisible: false,
  };

  onPress = () => {
    this.setState({ toolTipVisible: false });
    this.props.navigateDrawerOpen();
  };

  render() {
    return (
      <Tooltip
        isVisible={this.state.toolTipVisible}
        placement="bottom"
        content={<ConnectHealthTooltipContent />}
        arrowStyle={{
          marginLeft: -5,
        }}
        adjustPlacementStyle={placementStyle => {
          const { left, top, ...rest } = placementStyle;
          return {
            ...rest,
            left: left + 4,
            top: Platform.OS === "ios" ? top + 2 : top + 5,
          };
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
  navigateDrawerOpen: PropTypes.func.isRequired,
};

export default HomeScreenHeaderLeft;
