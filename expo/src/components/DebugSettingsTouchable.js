import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { ViewPropTypes } from "react-native";
import glamorous from "glamorous-native";

class DebugSettingsTouchable extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      lastTouchTime: 0,
      touchCount: 0,
    };
  }

  onPress = () => {
    const touchTime = new Date().getTime();
    const millisecondsSinceLastTouch = touchTime - this.state.lastTouchTime;
    const previousTouchCount = this.state.touchCount;
    let touchCount =
      millisecondsSinceLastTouch < 500 ? previousTouchCount + 1 : 1;

    if (touchCount === 7) {
      this.props.navigateDebugSettings();
      touchCount = 0;
    }

    this.setState({
      touchCount,
      lastTouchTime: touchTime,
    });
  };

  render() {
    const { style } = this.props;

    return (
      <glamorous.View style={style}>
        <glamorous.TouchableOpacity activeOpacity={1} onPress={this.onPress}>
          {this.props.children}
        </glamorous.TouchableOpacity>
      </glamorous.View>
    );
  }
}

DebugSettingsTouchable.propTypes = {
  style: ViewPropTypes.style,
  navigateDebugSettings: PropTypes.func.isRequired,
  children: PropTypes.element.isRequired,
};

DebugSettingsTouchable.defaultProps = {
  style: null,
};

export default DebugSettingsTouchable;
