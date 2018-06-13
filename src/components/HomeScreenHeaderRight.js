import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Image, Platform, TouchableOpacity } from "react-native";

import Tooltip from "./Tooltip";
import SimpleTextTooltipContent from "../components/Tooltips/SimpleTextTooltipContent";

class HomeScreenHeaderRight extends PureComponent {
  state = {
    toolTipVisible: false,
  };

  onPress = () => {
    this.setState({ toolTipVisible: false });
    this.props.navigateAddNote();
  };

  render() {
    return (
      <Tooltip
        isVisible={this.state.toolTipVisible}
        placement="bottom"
        content={
          <SimpleTextTooltipContent text="Now, add an event, a meal, or note." />
        }
        arrowStyle={{
          marginLeft: 5,
        }}
        adjustPlacementStyle={placementStyle => {
          const { left, top, ...rest } = placementStyle;
          return {
            ...rest,
            left: left - 4,
            top: Platform.OS === "ios" ? top : top + 3,
          };
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
  navigateAddNote: PropTypes.func.isRequired,
};

export default HomeScreenHeaderRight;
