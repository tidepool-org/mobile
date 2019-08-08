import React, { PureComponent } from "react";
import { StyleSheet, View } from "react-native";

import PropTypes from "prop-types";
import RNPickerSelect from "react-native-picker-select";
import { Ionicons } from "@expo/vector-icons";

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    borderColor: "#ededed",
    borderRadius: 4,
    borderWidth: 1,
    color: "#838383",
    fontSize: 18,
    height: 58,
    paddingRight: 30, // to ensure the text is never behind the icon
    paddingLeft: 16,
  },
  inputAndroid: {
    borderColor: "#ededed",
    borderRadius: 8,
    borderWidth: 0.5,
    color: "#838383",
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});

class SingleSelectCustom extends PureComponent {
  render() {
    const { placeholder } = this.props;

    return (
      <View style={{ paddingTop: 32 }}>
        <RNPickerSelect
          placeholder={placeholder}
          onValueChange={value => value}
          items={[
            { label: "Football", value: "football" },
            { label: "Baseball", value: "baseball" },
            { label: "Hockey", value: "hockey" },
          ]}
          style={{
            fontSize: 88,
            lineHeight: 18,
            paddingTop: 20,
            paddingBottom: 20,
            paddingLeft: 16,

            ...pickerSelectStyles,
            iconContainer: {
              paddingTop: 20,
              paddingRight: 15,
            },
          }}
          Icon={() => {
            return (
              <Ionicons name="md-arrow-dropdown" size={24} color="#838383" />
            );
          }}
        />
      </View>
    );
  }
}

SingleSelectCustom.propTypes = {
  placeholder: PropTypes.object,
};

SingleSelectCustom.defaultProps = {
  placeholder: {
    label: "Select...",
    value: null,
    color: "#838383",
  },
};

export { SingleSelectCustom };
