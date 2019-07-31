/* eslint import/no-extraneous-dependencies: 0 */
import React from "react";
import { storiesOf } from "@storybook/react-native";

import DatePicker from "react-native-datepicker";

import StoryContainerComponent from "../utils/StoryContainerComponent";


storiesOf("DatePicker", module).add("default", () => (
  <StoryContainerComponent>
        <DatePicker
            style={{ width: 200 }}
            date={"2016-05-15"}
            mode="date"
            placeholder="select date"
            format="YYYY-MM-DD"
            minDate="2016-05-01"
            maxDate="2016-06-01"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            customStyles={{
                dateIcon: {
                    position: 'absolute',
                    left: 0,
                    top: 4,
                    marginLeft: 0
                },
                dateInput: {
                    marginLeft: 36
                }
                // ... You can check the source to find the other keys.
            }}
            // onDateChange={(date) => { this.setState({ date: date }) }}
        />
  </StoryContainerComponent>
));