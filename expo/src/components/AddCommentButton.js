import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { ViewPropTypes } from "react-native";
import glamorous, { withTheme } from "glamorous-native";

import { ThemePropType } from "../prop-types/theme";

class AddCommentButton extends PureComponent {
  onPress = () => {
    this.props.onPress();
  };

  render() {
    const { theme, style } = this.props;

    return (
      <glamorous.View style={style}>
        <glamorous.TouchableOpacity
          flexDirection="row"
          alignItems="center"
          onPress={this.onPress}
          padding={8}
        >
          <glamorous.Image
            source={require("../../assets/images/add-comment.png")}
            width={23}
            height={19}
            marginRight={10}
          />
          <glamorous.Text
            allowFontScaling={false}
            style={theme.addCommentTextStyle}
          >
            Add Comment
          </glamorous.Text>
        </glamorous.TouchableOpacity>
      </glamorous.View>
    );
  }
}

AddCommentButton.propTypes = {
  theme: ThemePropType.isRequired,
  style: ViewPropTypes.style,
  onPress: PropTypes.func.isRequired,
};

AddCommentButton.defaultProps = {
  style: null,
};

export default withTheme(AddCommentButton);
