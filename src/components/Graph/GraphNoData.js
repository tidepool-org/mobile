import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import glamorous, { withTheme } from "glamorous-native";

import Metrics from "../../models/Metrics";
import { ThemePropType } from "../../prop-types/theme";
// import Logger from "../../models/Logger";

class GraphNoData extends PureComponent {
  onPressHowToUpload = () => {
    const { navigateHowToUpload } = this.props;
    Metrics.track({ metric: "Clicked how to upload button" });
    navigateHowToUpload();
  };

  render() {
    // console.log(`GraphNoData: render`);

    const {
      theme,
      graphFixedLayoutInfo,
      navigateHowToUpload,
      isOffline,
      isAvailableOffline,
    } = this.props;

    let noDataText = "No data";
    if (isOffline && !isAvailableOffline) {
      noDataText = "No offline data available";
    }

    return (
      <glamorous.View>
        <glamorous.Text
          key={1}
          allowFontScaling={false}
          position="absolute"
          pointerEvents="none"
          style={theme.graphNoDataLabelStyle}
          top={graphFixedLayoutInfo.graphLayerHeight - 50}
          left={graphFixedLayoutInfo.width - 160}
        >
          {noDataText}
        </glamorous.Text>
        <glamorous.TouchableOpacity
          key={2}
          position="absolute"
          top={graphFixedLayoutInfo.graphLayerHeight - 30}
          left={graphFixedLayoutInfo.width - 160}
          hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}
          onPress={navigateHowToUpload}
        >
          <glamorous.Text
            allowFontScaling={false}
            style={theme.graphHowToUploadLabelStyle}
          >
            How to upload
          </glamorous.Text>
        </glamorous.TouchableOpacity>
      </glamorous.View>
    );
  }
}

GraphNoData.propTypes = {
  theme: ThemePropType.isRequired,
  graphFixedLayoutInfo: PropTypes.object.isRequired,
  navigateHowToUpload: PropTypes.func.isRequired,
  isOffline: PropTypes.bool,
  isAvailableOffline: PropTypes.bool,
};

GraphNoData.defaultProps = {
  isOffline: false,
  isAvailableOffline: false,
};

export { GraphNoData as GraphNoDataClass };
export default withTheme(GraphNoData);
