import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { View, Text, Switch } from "react-native";

class SwitchCustom extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      switchValue: false,
    };
  }

  toggleSwitch = (value) => {
    this.setState({switchValue: value})
  }

  render() {
    const { switchText } = this.props;
    return (
      <View style={{ display: "flex" }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Switch
            trackColor={{ true: "#627cff" }}
            value={this.state.switchValue}
            onValueChange={this.toggleSwitch}
          />
          <Text
            style={{
              color: "#4f6a92",
              fontSize: 16,
              marginLeft: 10,
            }}
          >
            {switchText}
          </Text>
        </View>
      </View>
    );
  }
}

SwitchCustom.propTypes = {
  switchText: PropTypes.string,
};

SwitchCustom.defaultProps = {
  switchText: "Flip this switch",
};

export { SwitchCustom };
