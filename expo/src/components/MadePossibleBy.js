import React, { PureComponent } from "react";
import glamorous, { withTheme } from "glamorous-native";

import ThemePropTypes from "../themes/ThemePropTypes";

class MadePossibleBy extends PureComponent {
  render() {
    const { theme } = this.props;

    return (
      <glamorous.View
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
      >
        <glamorous.Text
          allowFontScaling={false}
          style={theme.madePossibleByTextStyle}
          marginRight={3}
        >
          Made possible by
        </glamorous.Text>
        <glamorous.Image
          source={require("../../assets/images/jdrf-logo.png")}
          width={97.5}
          height={25}
          alignSelf="center"
        />
      </glamorous.View>
    );
  }
}

MadePossibleBy.propTypes = {
  theme: ThemePropTypes.isRequired,
};

export default withTheme(MadePossibleBy);
