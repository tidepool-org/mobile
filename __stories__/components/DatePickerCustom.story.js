/* eslint import/no-extraneous-dependencies: 0 */
import React from "react";
import { storiesOf } from "@storybook/react-native";

import DatePicker from "react-native-datepicker";

import StoryContainerComponent from "../utils/StoryContainerComponent";

storiesOf("DatePickerCustom", module).add("default (NoSnapshot)", () => (
  <StoryContainerComponent>
    <DatePicker
      style={{
        width: 350,
        marginTop: 10,
        marginBottom: 10,
      }}
      date=""
      mode="date"
      placeholder="Select Date"
      format="MM-DD-YYYY"
      minDate="05-01-2016"
      maxDate="06-01-2021"
      confirmBtnText="Confirm"
      cancelBtnText="Cancel"
      customStyles={{
        dateInput: {
          borderColor: "#ededed",
          borderRadius: 4,
          height: 58,
        },
        dateText: {
          color: "#627cff",
          fontSize: 18,
          lineHeight: 18,
          paddingTop: 20,
          paddingBottom: 20,
          paddingLeft: 16,
        },
        placeholderText: {
          color: "#838383",
          fontSize: 18,
          lineHeight: 18,
          paddingTop: 20,
          paddingBottom: 20,
          paddingLeft: 16,
        },
        btnTextConfirm: {
          color: "#627cff",
        },
        dateIcon: {
          position: "absolute",
          right: 0,
          top: 4,
          marginLeft: 0,
        },
      }}
      iconSource={require("../assets/arrow-drop-down-24-px-2x.png")}
    />
  </StoryContainerComponent>
));

storiesOf("DatePickerCustom", module).add("selected", () => (
  <StoryContainerComponent>
    <DatePicker
      style={{
        width: 350,
        marginTop: 10,
        marginBottom: 10,
      }}
      date="10-12-2017"
      mode="date"
      placeholder="Select Date"
      format="MM-DD-YYYY"
      minDate="05-01-2016"
      maxDate="06-01-2021"
      confirmBtnText="Confirm"
      cancelBtnText="Cancel"
      customStyles={{
        dateInput: {
          borderColor: "#ededed",
          borderRadius: 4,
          height: 58,
        },
        dateText: {
          color: "#627cff",
          fontSize: 18,
          lineHeight: 18,
          paddingTop: 20,
          paddingBottom: 20,
          paddingLeft: 16,
        },
        placeholderText: {
          color: "#838383",
          fontSize: 18,
          lineHeight: 18,
          paddingTop: 20,
          paddingBottom: 20,
          paddingLeft: 16,
        },
        btnTextConfirm: {
          color: "#627cff",
        },
        dateIcon: {
          position: "absolute",
          right: 0,
          top: 4,
          marginLeft: 0,
        },
      }}
      iconSource={require("../assets/arrow-drop-down-24-px-2x.png")}
    />
  </StoryContainerComponent>
));
