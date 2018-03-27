import React, { Component } from "react";
import PropTypes from "prop-types";
import glamorous, { withTheme } from "glamorous-native";

import { ThemePropType } from "../../prop-types/theme";

class GraphNoData extends Component {
  onPressHowToUpload = () => {
    this.props.navigateHowToUpload();
  };

  render() {
    const { theme, graphFixedLayoutInfo } = this.props;

    return (
      <glamorous.View>
        <glamorous.Text
          allowFontScaling={false}
          position="absolute"
          pointerEvents="none"
          style={theme.graphNoDataLabelStyle}
          top={graphFixedLayoutInfo.graphLayerHeight - 50}
          left={graphFixedLayoutInfo.width - 120}
        >
          No data
        </glamorous.Text>
        <glamorous.TouchableOpacity
          position="absolute"
          top={graphFixedLayoutInfo.graphLayerHeight - 30}
          left={graphFixedLayoutInfo.width - 120}
          hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}
          onPress={this.onPressHowToUpload}
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
};

export default withTheme(GraphNoData);
