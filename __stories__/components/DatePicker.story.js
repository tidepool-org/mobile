/* eslint import/no-extraneous-dependencies: 0 */
import React from "react";
import { storiesOf } from "@storybook/react-native";

import StoryContainerComponent from "../utils/StoryContainerComponent";

import { DatePicker } from "native-base";

storiesOf("DatePicker", module).add("default", () => (
  <StoryContainerComponent>
        <DatePicker
            defaultDate={new Date(2018, 4, 4)}
            minimumDate={new Date(2000, 1, 1)}
            maximumDate={new Date(2020, 12, 31)}
            locale={"en"}
            timeZoneOffsetInMinutes={undefined}
            modalTransparent={false}
            animationType={"fade"}
            androidMode={"default"}
            placeHolderText="Select date"
            textStyle={{ color: "green" }}
            placeHolderTextStyle={{ color: "#d3d3d3" }}
            onDateChange={this.setDate}
            disabled={false}
        />
  </StoryContainerComponent>
));