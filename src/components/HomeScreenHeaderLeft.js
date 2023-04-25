import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Image, TouchableOpacity } from "react-native";
import { useNavigation } from '@react-navigation/native';

import FirstTimeTips from "../models/FirstTimeTips";
import Tooltip from "./Tooltip";
import ConnectHealthTooltipContent from "./Tooltips/ConnectHealthTooltipContent";
import Metrics from "../models/Metrics";

const HomeScreenHeaderLeft = (props) => {
  const [toolTipVisible, setToolTipVisible] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    showTipIfNeeded();
    return () => {
      if (showTipTimeoutId) {
        clearTimeout(showTipTimeoutId);
      }
    };
  }, [props]);

  const onPress = () => {
    props.navigateDrawerOpen(navigation);
    Metrics.track({ metric: "Clicked Hamburger (Home Screen)" });
    hideTipIfNeeded();
  };

  let showTipTimeoutId = null;

  const showTipIfNeeded = () => {
    const { notesFetch, currentUser } = props;
    if (
      FirstTimeTips.shouldShowTip(
        FirstTimeTips.TIP_CONNECT_TO_HEALTH,
        { navigation, notesFetch, currentUser }
      )
    ) {
      props.firstTimeTipsShowTip(FirstTimeTips.TIP_CONNECT_TO_HEALTH, true);
      showTipTimeoutId = setTimeout(() => {
        setToolTipVisible(true);
      }, 50);
    }
  };

  const hideTipIfNeeded = () => {
    if (FirstTimeTips.currentTip === FirstTimeTips.TIP_CONNECT_TO_HEALTH) {
      props.firstTimeTipsShowTip(FirstTimeTips.TIP_CONNECT_TO_HEALTH, false);
      setToolTipVisible(false);
    }
  };

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
        onPress={onPress}
      >
        <Image
          tintColor="white"
          source={require("../../assets/images/menu-button.png")}
        />
      </TouchableOpacity>
    </Tooltip>
  );
};

HomeScreenHeaderLeft.propTypes = {
  notesFetch: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired,
  navigateDrawerOpen: PropTypes.func.isRequired,
  firstTimeTipsShowTip: PropTypes.func.isRequired,
};

export default HomeScreenHeaderLeft;
