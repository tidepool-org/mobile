import React, { PureComponent } from "react";
import { ViewPropTypes } from "react-native";
import glamorous, { withTheme } from "glamorous-native";

import ThemePropTypes from "../themes/ThemePropTypes";

class NotesListItemAddComment extends PureComponent {
  onPress = () => {
    // TODO: navigate - add comment
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

NotesListItemAddComment.propTypes = {
  theme: ThemePropTypes.isRequired,
  style: ViewPropTypes.style,
};

NotesListItemAddComment.defaultProps = {
  style: null,
};

export default withTheme(NotesListItemAddComment);
