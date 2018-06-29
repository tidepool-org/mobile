import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import glamorous, { withTheme } from "glamorous-native";

import { ThemePropType } from "../../prop-types/theme";

class GraphNoData extends PureComponent {
  onPressHowToUpload = () => {
    const { navigateHowToUpload } = this.props;
    navigateHowToUpload();
  };

  static renderGraphNoDataViews({
    theme,
    graphFixedLayoutInfo,
    navigateHowToUpload,
  }) {
    return [
      <glamorous.Text
        key={1}
        allowFontScaling={false}
        position="absolute"
        pointerEvents="none"
        style={theme.graphNoDataLabelStyle}
        top={graphFixedLayoutInfo.graphLayerHeight - 50}
        left={graphFixedLayoutInfo.width - 120}
      >
        No data
      </glamorous.Text>,
      <glamorous.TouchableOpacity
        key={2}
        position="absolute"
        top={graphFixedLayoutInfo.graphLayerHeight - 30}
        left={graphFixedLayoutInfo.width - 120}
        hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}
        onPress={navigateHowToUpload}
      >
        <glamorous.Text
          allowFontScaling={false}
          style={theme.graphHowToUploadLabelStyle}
        >
          How to upload
        </glamorous.Text>
      </glamorous.TouchableOpacity>,
    ];
  }

  render() {
    // console.log("GraphNoData: render");

    const { theme, graphFixedLayoutInfo } = this.props;

    return (
      <glamorous.View>
        {GraphNoData.renderGraphNoDataViews({
          theme,
          graphFixedLayoutInfo,
          navigateHowToUpload: this.onPressHowToUpload,
        })}
      </glamorous.View>
    );
  }
}

GraphNoData.propTypes = {
  theme: ThemePropType.isRequired,
  graphFixedLayoutInfo: PropTypes.object.isRequired,
  navigateHowToUpload: PropTypes.func.isRequired,
};

export { GraphNoData as GraphNoDataClass };
export default withTheme(GraphNoData);
