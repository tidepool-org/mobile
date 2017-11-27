import React from "react";
import PropTypes from "prop-types";

import Drawer from "../components/Drawer";

const DrawerContainer = ({ navigation }) => (
  <Drawer
    navigation={navigation}
    style={{
      flex: 1,
      marginTop: 0,
    }}
    currentUser={{ username: "foo@bar.com" }} // TODO: redux
  />
);

DrawerContainer.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
  }).isRequired,
};

export default DrawerContainer;
