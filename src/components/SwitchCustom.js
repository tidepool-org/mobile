import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { View, Text, Switch } from "react-native";


class SwitchCustom extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      date: "",
    };
  }

  render() {
    const { placeholder } = this.props;

    return (
      <View style={{ display: "flex" }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Switch trackColor={{ true: "#627cff" }} />
          <Text style={{ color: "#4f6a92", fontSize: 16, marginLeft: 10 }}>
            Donate my anonymized diabetes data
          </Text>
        </View>

      </View>
    );
  }
}

SwitchCustom.propTypes = {
  placeholder: PropTypes.string,
};

SwitchCustom.defaultProps = {
  placeholder: "Select Date",
};

export default SwitchCustom;
