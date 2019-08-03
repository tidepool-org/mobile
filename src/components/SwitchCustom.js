import React, { PureComponent } from "react";
import { View, Text, Switch } from "react-native";


class SwitchCustom extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {

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


export default SwitchCustom;
