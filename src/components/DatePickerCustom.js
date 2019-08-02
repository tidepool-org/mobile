import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { View } from "react-native";

import DatePicker from "react-native-datepicker";

class DatePickerCustom extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      date: "",
    };
  }

  render() {
    const { placeholder } = this.props;

    this.setState({
      dateToday: `${new Date().getMonth() +
        1}-${new Date().getDate()}-${new Date().getFullYear()}`,
    });

    return (
      <View>
        <DatePicker
          style={{
            width: 340,
            marginTop: 20,
            marginBottom: 10,
          }}
          date={this.state.date}
          mode="date"
          placeholder={placeholder}
          format="MM-DD-YYYY"
          minDate="01-01-1900"
          maxDate={this.state.dateToday}
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
          iconSource={require("../../assets/images/arrow-drop-down-24-px-2x.png")}
          onDateChange={date => {
            this.setState({ date });
          }}
        />
      </View>
    );
  }
}

DatePickerCustom.propTypes = {
  placeholder: PropTypes.string,
};

DatePickerCustom.defaultProps = {
  placeholder: "Select Date",
};

export default DatePickerCustom;
