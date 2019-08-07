import React, { PureComponent } from "react";

import { StyleSheet, View } from "react-native";

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
             // const { placeholder } = this.props;
             const placeholder = {
               label: "Select Data Donation Org...",
               value: null,
               color: "#9EA0A4",
             };
             const sports = [
               {
                 label: "Football",
                 value: "football",
               },
               {
                 label: "Baseball",
                 value: "baseball",
               },
               {
                 label: "Hockey",
                 value: "hockey",
               },
             ];

             return (
               <View style={{ paddingTop: 32 }}>
                 <RNPickerSelect
                   placeholder={placeholder}
                   items={sports}
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
                       <Ionicons
                         name="md-arrow-dropdown"
                         size={24}
                         color="gray"
                       />
                     );
                   }}
                 />
               </View>
             );
           }
}



SingleSelectCustom.propTypes = {
    // placeholder: PropTypes.string,
};

SingleSelectCustom.defaultProps = {
//   placeholder: "Select...",
};

export { SingleSelectCustom };
