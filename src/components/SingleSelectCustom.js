import React, { PureComponent } from "react";
import { StyleSheet, View } from "react-native";

import PropTypes from "prop-types";
import RNPickerSelect from "react-native-picker-select";
import { Ionicons } from "@expo/vector-icons";

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 18,

    paddingLeft: 16,
    borderWidth: 1,
    borderColor: "#ededed",
    borderRadius: 4,
    height: 58,
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderRadius: 8,
    color: "black",
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
            return <Ionicons name="md-arrow-dropdown" size={24} color="gray" />;
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
    color: "#9EA0A4",
  },
};

export { SingleSelectCustom };
