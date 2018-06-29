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
    const { navigateDebugSettings } = this.props;
    const { lastTouchTime, touchCount: previousTouchCount } = this.state;
    const touchTime = new Date().getTime();
    const millisecondsSinceLastTouch = touchTime - lastTouchTime;
    let touchCount =
      millisecondsSinceLastTouch < 500 ? previousTouchCount + 1 : 1;

    if (touchCount === 7) {
      navigateDebugSettings();
      touchCount = 0;
    }

    this.setState({
      touchCount,
      lastTouchTime: touchTime,
    });
  };

  render() {
    const { style, children } = this.props;

    return (
      <glamorous.View style={style}>
        <glamorous.TouchableOpacity
          activeOpacity={1}
          onPress={this.onPress}
          hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}
        >
          {children}
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
