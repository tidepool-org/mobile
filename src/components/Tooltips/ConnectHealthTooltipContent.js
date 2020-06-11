import React, { PureComponent } from "react";
import glamorous from "glamorous-native";

import PrimaryTheme from "../../themes/PrimaryTheme";

class ConnectHealthTooltipContent extends PureComponent {
  theme = PrimaryTheme;

  render() {
    return (
      <glamorous.View padding={4} flexDirection="row">
        <glamorous.Image
          source={require("../../../assets/images/first-time-health-icon.png")}
          marginTop={-3}
          width={50}
          height={50}
          alignSelf="center"
        />
        <glamorous.Text
          marginLeft={8}
          width={210}
          allowFontScaling={false}
          style={this.theme.toolTipContentTextStyle}
        >
          Connect Health to get your CGM data to start flowing in.
        </glamorous.Text>
      </glamorous.View>
    );
  }
}

export default ConnectHealthTooltipContent;
