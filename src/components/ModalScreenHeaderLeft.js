import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import glamorous, { withTheme } from "glamorous-native";

class ModalScreenHeaderLeft extends PureComponent {
  onPress = () => {
    const { action } = this.props;
    action();
  };

  render() {
    return (
      <glamorous.TouchableOpacity
        style={{
          padding: 10,
          marginLeft: 6,
        }}
        onPress={this.onPress}
      >
        <glamorous.Image source={require("../../assets/images/close.png")} />
      </glamorous.TouchableOpacity>
    );
  }
}

ModalScreenHeaderLeft.propTypes = {
  action: PropTypes.func.isRequired,
};

export default withTheme(ModalScreenHeaderLeft);
