import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Image, TouchableOpacity } from "react-native";

class HomeScreenHeaderRight extends PureComponent {
  onPress = () => {
    this.props.navigateAddNote();
  };

  render() {
    return (
      <TouchableOpacity
        style={{
          padding: 10,
          marginRight: 6,
        }}
        onPress={this.onPress}
      >
        <Image source={require("../../assets/images/add-button.png")} />
      </TouchableOpacity>
    );
  }
}

HomeScreenHeaderRight.propTypes = {
  navigateAddNote: PropTypes.func.isRequired,
};

export default HomeScreenHeaderRight;
