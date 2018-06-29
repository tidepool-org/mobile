import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import glamorous from "glamorous-native";

import PrimaryTheme from "../../themes/PrimaryTheme";
import Button from "../Button";

class TidepoolUploaderTooltipContent extends PureComponent {
  theme = PrimaryTheme;

  render() {
    const { onPressEmailLink, onPressOk } = this.props;

    return (
      <glamorous.View width={260} padding={8}>
        <glamorous.Text
          allowFontScaling={false}
          textAlign="center"
          paddingBottom={16}
          style={this.theme.toolTipContentTextStyle}
        >
          Woohoo!
          {"\n\n"}
          Last step: to get pump data, you need the Tidepool Uploader on your
          computer.
        </glamorous.Text>
        <glamorous.View flexDirection="row" justifyContent="space-between">
          <Button
            containerStyle={{ width: 115, paddingLeft: 0, paddingRight: 0 }}
            onPress={onPressEmailLink}
            title="Email Link"
            textStyle={this.theme.toolTipContentButtonTextStyle}
          />
          <Button
            containerStyle={{ width: 115, paddingLeft: 0, paddingRight: 0 }}
            onPress={onPressOk}
            title="OK"
            textStyle={this.theme.toolTipContentButtonTextStyle}
          />
        </glamorous.View>
      </glamorous.View>
    );
  }
}

TidepoolUploaderTooltipContent.propTypes = {
  onPressEmailLink: PropTypes.func.isRequired,
  onPressOk: PropTypes.func.isRequired,
};

export default TidepoolUploaderTooltipContent;
